import {
  Injectable,
  NotFoundException,
  GoneException,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailVerificationService } from '../email-verification/email-verification.service';
import { OrganizationVerificationService } from '../organization-verification/organization-verification.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserResponseDto } from './dto/delete-user-response.dto';
import { UserStatusResponseDto } from './dto/user-status-response.dto';
import {
  BatchApproveUsersResponseDto,
  ApprovedUserResult,
  FailedUserResult,
} from './dto/batch-approve-users-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private emailVerificationService: EmailVerificationService,
    private organizationVerificationService: OrganizationVerificationService,
  ) {}

  /**
   * 회원가입 (이메일 인증 포함)
   */
  async register(createUserDto: CreateUserDto) {
    const {
      verificationCode,
      organizationCode,
      dateOfBirth,
      ...userData
    } = createUserDto;

    // 이메일 인증코드 검증
    await this.emailVerificationService.verifyCode({
      email: userData.email,
      code: verificationCode,
    });

    // 조직 코드 검증
    this.organizationVerificationService.verifyOrganizationCode(
      organizationCode,
    );

    // 이미 가입된 사용자 확인
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser && !existingUser.deletedAt) {
      throw new ConflictException('이미 가입된 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        emailVerified: true,
        approvedByAdmin: false,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        approvedByAdmin: true,
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
  }

  /**
   * 사용자 생성 (내부 사용, 관리자용)
   */
  async create(createUserDto: CreateUserDto) {
    const { verificationCode, dateOfBirth, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        emailVerified: true,
        approvedByAdmin: false,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        approvedByAdmin: true,
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
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        approvedByAdmin: true,
        dateOfBirth: true,
        gender: true,
        height: true,
        weight: true,
        sido: true,
        guGun: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        // password 필드는 제외
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        approvedByAdmin: true,
        dateOfBirth: true,
        gender: true,
        height: true,
        weight: true,
        sido: true,
        guGun: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        // password 필드는 제외
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.deletedAt) {
      throw new GoneException(`User with ID ${id} has been deleted`);
    }

    return user;
  }

  /**
   * 사용자 상태 조회
   */
  async getUserStatus(id: string): Promise<UserStatusResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        approvedByAdmin: true,
        approvedAt: true,
        approvedById: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      approvedByAdmin: user.approvedByAdmin,
      approvedAt: user.approvedAt || undefined,
      approvedById: user.approvedById || undefined,
    };
  }

  /**
   * 관리자 승인
   */
  async approveUser(id: string, adminId: string) {
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
      throw new BadRequestException('이메일 인증이 완료되지 않은 사용자입니다.');
    }

    if (user.approvedByAdmin) {
      throw new ConflictException('이미 승인된 사용자입니다.');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        approvedByAdmin: true,
        approvedAt: new Date(),
        approvedById: adminId,
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
            approvedById: adminId,
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
          error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // 존재 여부 및 삭제 여부 확인

    const updateData: any = { ...updateUserDto };

    // verificationCode는 업데이트에서 제외
    delete updateData.verificationCode;

    // 비밀번호가 있는 경우 해싱
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // dateOfBirth 문자열을 DateTime으로 변환
    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        approvedByAdmin: true,
        dateOfBirth: true,
        gender: true,
        height: true,
        weight: true,
        sido: true,
        guGun: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        // password 필드는 제외
      },
    });
  }

  async remove(id: string): Promise<DeleteUserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.deletedAt) {
      throw new GoneException(`User with ID ${id} has already been deleted`);
    }

    const deletedUser = await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return {
      id: deletedUser.id,
      email: deletedUser.email,
      name: deletedUser.name || undefined,
      deletedAt: deletedUser.deletedAt!,
      message: '사용자가 성공적으로 삭제되었습니다.',
    };
  }
}
