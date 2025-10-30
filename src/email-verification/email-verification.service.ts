import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { SendVerificationCodeDto } from './dto/send-verification-code.dto';
import { VerifyEmailCodeDto } from './dto/verify-email-code.dto';

@Injectable()
export class EmailVerificationService {
  private readonly codeLength: number;
  private readonly codeExpiryMinutes: number;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.codeLength =
      parseInt(this.configService.get('EMAIL_VERIFICATION_CODE_LENGTH', '6')) ||
      6;
    this.codeExpiryMinutes =
      parseInt(
        this.configService.get('EMAIL_VERIFICATION_CODE_EXPIRY_MINUTES', '10'),
      ) || 10;
  }

  /**
   * 인증코드 생성 (6자리 숫자)
   */
  private generateCode(): string {
    const min = Math.pow(10, this.codeLength - 1);
    const max = Math.pow(10, this.codeLength) - 1;
    return crypto.randomInt(min, max + 1).toString();
  }

  /**
   * 인증코드 발급
   */
  async sendVerificationCode(
    dto: SendVerificationCodeDto,
  ): Promise<{ code: string; expiresAt: Date; message: string }> {
    const { email } = dto;

    // 이미 가입된 이메일 확인
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && !existingUser.deletedAt) {
      throw new ConflictException('이미 가입된 이메일입니다.');
    }

    // 인증코드 생성
    const code = this.generateCode();
    const hashedCode = await bcrypt.hash(code, 10);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.codeExpiryMinutes);

    // 기존 인증코드가 있으면 업데이트, 없으면 생성
    await this.prisma.emailVerification.upsert({
      where: { email },
      update: {
        code: hashedCode,
        expiresAt,
        verifiedAt: null,
        updatedAt: new Date(),
      },
      create: {
        email,
        code: hashedCode,
        expiresAt,
      },
    });

    // 개발 환경에서는 코드를 응답으로 반환
    return {
      code,
      expiresAt,
      message: '인증코드가 발급되었습니다.',
    };
  }

  /**
   * 인증코드 검증
   */
  async verifyCode(dto: VerifyEmailCodeDto): Promise<boolean> {
    const { email, code } = dto;

    const verification = await this.prisma.emailVerification.findUnique({
      where: { email },
    });

    if (!verification) {
      throw new BadRequestException('인증코드가 발급되지 않은 이메일입니다.');
    }

    // 만료 확인
    if (new Date() > verification.expiresAt) {
      throw new UnauthorizedException('인증코드가 만료되었습니다.');
    }

    // 이미 사용된 코드 확인
    if (verification.verifiedAt) {
      throw new BadRequestException('이미 사용된 인증코드입니다.');
    }

    // 코드 검증
    const isCodeValid = await bcrypt.compare(code, verification.code);

    if (!isCodeValid) {
      throw new UnauthorizedException('인증코드가 일치하지 않습니다.');
    }

    // 검증 완료 표시
    await this.prisma.emailVerification.update({
      where: { email },
      data: {
        verifiedAt: new Date(),
      },
    });

    return true;
  }

  /**
   * 인증코드 재발급
   */
  async resendCode(
    dto: SendVerificationCodeDto,
  ): Promise<{ code: string; expiresAt: Date; message: string }> {
    return this.sendVerificationCode(dto);
  }
}

