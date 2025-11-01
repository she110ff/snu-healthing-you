import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('관리자 권한이 필요합니다.');
    }

    // Admin 모델에서 해당 id로 관리자가 존재하는지 확인
    const admin = await this.prisma.admin.findUnique({
      where: { id: user.id },
    });

    if (!admin) {
      throw new ForbiddenException('관리자 권한이 필요합니다.');
    }

    return true;
  }
}

