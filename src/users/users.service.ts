import {
  Injectable,
  NotFoundException,
  GoneException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrganizationVerificationService } from '../organization-verification/organization-verification.service';
import { RegionCodeService } from '../region-code/region-code.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserResponseDto } from './dto/delete-user-response.dto';
import { UserStatusResponseDto } from './dto/user-status-response.dto';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private organizationVerificationService: OrganizationVerificationService,
    private regionCodeService: RegionCodeService,
  ) {}

  /**
   * 회원가입
   */
  async register(createUserDto: CreateUserDto) {
    const {
      organizationCode,
      dateOfBirth,
      sidoCode,
      guGunCode,
      ...userData
    } = createUserDto;

    // 조직 코드 검증
    this.organizationVerificationService.verifyOrganizationCode(
      organizationCode,
    );

    // 지역 코드 검증
    await this.regionCodeService.validateRegionCode(sidoCode);
    await this.regionCodeService.validateRegionDetailCode(guGunCode);

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    try {
      return await this.prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          emailVerified: true,
          approvedByAdmin: false,
          dateOfBirth: new Date(dateOfBirth),
          sidoCode,
          guGunCode,
        },
        include: {
          sidoRegion: true,
          guGunRegionDetail: {
            include: {
              region: true,
            },
          },
        },
      });
    } catch (error) {
      // 이메일 중복 에러 처리 (Prisma unique constraint)
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002' &&
        Array.isArray(error.meta?.target) &&
        error.meta.target.includes('email')
      ) {
        throw new ConflictException('이미 가입된 이메일입니다.');
      }
      throw error;
    }
  }

  /**
   * 사용자 생성 (내부 사용, 관리자용)
   */
  async create(createUserDto: CreateUserDto) {
    const { dateOfBirth, sidoCode, guGunCode, ...userData } = createUserDto;
    
    // 지역 코드 검증
    await this.regionCodeService.validateRegionCode(sidoCode);
    await this.regionCodeService.validateRegionDetailCode(guGunCode);
    
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        emailVerified: true,
        approvedByAdmin: false,
        dateOfBirth: new Date(dateOfBirth),
        sidoCode,
        guGunCode,
      },
      include: {
        sidoRegion: true,
        guGunRegionDetail: {
          include: {
            region: true,
          },
        },
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
      include: {
        sidoRegion: true,
        guGunRegionDetail: {
          include: {
            region: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        sidoRegion: true,
        guGunRegionDetail: {
          include: {
            region: true,
          },
        },
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // 존재 여부 및 삭제 여부 확인

    const updateData: any = {};

    // 허용된 필드만 업데이트 데이터에 포함
    if (updateUserDto.dateOfBirth !== undefined) {
      updateData.dateOfBirth = new Date(updateUserDto.dateOfBirth);
    }
    if (updateUserDto.gender !== undefined) {
      updateData.gender = updateUserDto.gender;
    }
    if (updateUserDto.height !== undefined) {
      updateData.height = updateUserDto.height;
    }
    if (updateUserDto.weight !== undefined) {
      updateData.weight = updateUserDto.weight;
    }
    if (updateUserDto.sidoCode !== undefined) {
      await this.regionCodeService.validateRegionCode(updateUserDto.sidoCode);
      updateData.sidoCode = updateUserDto.sidoCode;
    }
    if (updateUserDto.guGunCode !== undefined) {
      await this.regionCodeService.validateRegionDetailCode(updateUserDto.guGunCode);
      updateData.guGunCode = updateUserDto.guGunCode;
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        sidoRegion: true,
        guGunRegionDetail: {
          include: {
            region: true,
          },
        },
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
