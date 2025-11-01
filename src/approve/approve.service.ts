import {
  Injectable,
  NotFoundException,
  GoneException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApproveUserResponseDto } from './dto/approve-user-response.dto';
import {
  BatchApproveUsersResponseDto,
  ApprovedUserResult,
  FailedUserResult,
} from './dto/batch-approve-users-response.dto';

@Injectable()
export class ApproveService {
  constructor(private prisma: PrismaService) {}

  /**
   * 단일 사용자 승인
   */
  async approveUser(
    id: string,
    adminId: string,
  ): Promise<ApproveUserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.deletedAt) {
      throw new GoneException(`User with ID ${id} has been deleted`);
    }

    if (!user.emailVerified) {
      throw new BadRequestException(
        '이메일 인증이 완료되지 않은 사용자입니다.',
      );
    }

    if (user.approvedByAdmin) {
      throw new ConflictException('이미 승인된 사용자입니다.');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        approvedByAdmin: true,
        approvedAt: new Date(),
        approvedById: null, // 관리자는 Admin 테이블에 있으므로 null로 설정
      },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        approvedByAdmin: true,
        approvedAt: true,
        approvedById: true,
        dateOfBirth: true,
        gender: true,
        height: true,
        weight: true,
        sido: true,
        guGun: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ...updatedUser,
      name: updatedUser.name ?? undefined,
      dateOfBirth: updatedUser.dateOfBirth ?? undefined,
      gender: updatedUser.gender ?? undefined,
      height: updatedUser.height ?? undefined,
      weight: updatedUser.weight ?? undefined,
      sido: updatedUser.sido ?? undefined,
      guGun: updatedUser.guGun ?? undefined,
      approvedAt: updatedUser.approvedAt!,
      approvedById: updatedUser.approvedById ?? null,
    };
  }

  /**
   * 복수 사용자 배치 승인
   */
  async approveUsers(
    ids: string[],
    adminId: string,
  ): Promise<BatchApproveUsersResponseDto> {
    const success: ApprovedUserResult[] = [];
    const failed: FailedUserResult[] = [];
    const approvedAt = new Date();

    // 중복 제거
    const uniqueIds = [...new Set(ids)];

    // 각 사용자에 대해 순차적으로 처리
    for (const id of uniqueIds) {
      try {
        const user = await this.prisma.user.findUnique({
          where: { id },
        });

        if (!user) {
          failed.push({
            id,
            error: '사용자를 찾을 수 없습니다.',
          });
          continue;
        }

        if (user.deletedAt) {
          failed.push({
            id,
            error: '이미 삭제된 사용자입니다.',
          });
          continue;
        }

        if (!user.emailVerified) {
          failed.push({
            id,
            error: '이메일 인증이 완료되지 않은 사용자입니다.',
          });
          continue;
        }

        if (user.approvedByAdmin) {
          failed.push({
            id,
            error: '이미 승인된 사용자입니다.',
          });
          continue;
        }

        // 승인 처리
        const approvedUser = await this.prisma.user.update({
          where: { id },
          data: {
            approvedByAdmin: true,
            approvedAt,
            approvedById: null, // 관리자는 Admin 테이블에 있으므로 null로 설정
          },
          select: {
            id: true,
            email: true,
            name: true,
            approvedAt: true,
          },
        });

        success.push({
          id: approvedUser.id,
          email: approvedUser.email,
          name: approvedUser.name || undefined,
          approvedAt: approvedUser.approvedAt!,
        });
      } catch (error) {
        // 예상치 못한 에러 처리
        failed.push({
          id,
          error:
            error instanceof Error
              ? error.message
              : '알 수 없는 오류가 발생했습니다.',
        });
      }
    }

    return {
      success,
      failed,
      summary: {
        total: uniqueIds.length,
        successCount: success.length,
        failedCount: failed.length,
      },
    };
  }
}
