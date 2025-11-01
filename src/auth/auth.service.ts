import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminLoginResponseDto } from './dto/admin-login-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    if (user.deletedAt) {
      throw new UnauthorizedException('삭제된 사용자입니다.');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('이메일 인증이 완료되지 않았습니다.');
    }

    if (!user.approvedByAdmin) {
      throw new UnauthorizedException('관리자 승인이 필요합니다.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async validateAdmin(name: string, password: string): Promise<any> {
    const admin = await this.prisma.admin.findFirst({
      where: { name },
    });

    if (!admin) {
      throw new NotFoundException('관리자를 찾을 수 없습니다.');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    return {
      id: admin.id,
      name: admin.name,
      role: 'ADMIN',
    };
  }

  async adminLogin(adminLoginDto: AdminLoginDto): Promise<AdminLoginResponseDto> {
    const admin = await this.validateAdmin(
      adminLoginDto.name,
      adminLoginDto.password,
    );

    const payload = {
      sub: admin.id,
      name: admin.name,
      role: admin.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      admin: {
        id: admin.id,
        name: admin.name,
        role: admin.role,
      },
    };
  }
}

