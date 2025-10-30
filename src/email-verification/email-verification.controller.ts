import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { EmailVerificationService } from './email-verification.service';
import { SendVerificationCodeDto } from './dto/send-verification-code.dto';
import { SendVerificationCodeResponseDto } from './dto/send-verification-code-response.dto';
import { VerifyEmailCodeDto } from './dto/verify-email-code.dto';
import { VerifyEmailResponseDto } from './dto/verify-email-response.dto';

@ApiTags('email-verification')
@Controller('email-verification')
export class EmailVerificationController {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '인증코드 발급',
    description: '이메일 인증을 위한 인증코드를 발급합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '인증코드가 성공적으로 발급되었습니다.',
    type: SendVerificationCodeResponseDto,
  })
  @ApiBadRequestResponse({
    description: '잘못된 요청입니다.',
  })
  @ApiConflictResponse({
    description: '이미 가입된 이메일입니다.',
  })
  async sendCode(
    @Body() dto: SendVerificationCodeDto,
  ): Promise<SendVerificationCodeResponseDto> {
    return this.emailVerificationService.sendVerificationCode(dto);
  }

  @Post('resend-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '인증코드 재발급',
    description: '인증코드를 재발급합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '인증코드가 성공적으로 재발급되었습니다.',
    type: SendVerificationCodeResponseDto,
  })
  @ApiBadRequestResponse({
    description: '잘못된 요청입니다.',
  })
  @ApiConflictResponse({
    description: '이미 가입된 이메일입니다.',
  })
  async resendCode(
    @Body() dto: SendVerificationCodeDto,
  ): Promise<SendVerificationCodeResponseDto> {
    return this.emailVerificationService.resendCode(dto);
  }

  @Post('verify-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '인증코드 검증',
    description: '발급된 인증코드를 검증합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '인증코드 검증이 완료되었습니다.',
    type: VerifyEmailResponseDto,
  })
  @ApiBadRequestResponse({
    description: '잘못된 요청입니다.',
  })
  @ApiUnauthorizedResponse({
    description: '인증코드가 일치하지 않거나 만료되었습니다.',
  })
  async verifyCode(
    @Body() dto: VerifyEmailCodeDto,
  ): Promise<VerifyEmailResponseDto> {
    const verified = await this.emailVerificationService.verifyCode(dto);
    return {
      verified,
      message: '이메일 인증이 완료되었습니다.',
    };
  }
}

