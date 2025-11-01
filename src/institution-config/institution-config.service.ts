import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInstitutionConfigDto } from './dto/create-institution-config.dto';
import { UpdateInstitutionConfigDto } from './dto/update-institution-config.dto';
import { InstitutionConfigResponseDto } from './dto/institution-config-response.dto';

@Injectable()
export class InstitutionConfigService {
  constructor(private prisma: PrismaService) {}

  async create(
    createDto: CreateInstitutionConfigDto,
  ): Promise<InstitutionConfigResponseDto> {
    // 중복 체크
    const existingByName = await this.prisma.institutionConfig.findUnique({
      where: { name: createDto.name },
    });
    if (existingByName) {
      throw new ConflictException(
        `기관명 '${createDto.name}'이 이미 존재합니다.`,
      );
    }

    const existingByEmailForm =
      await this.prisma.institutionConfig.findUnique({
        where: { emailForm: createDto.emailForm },
      });
    if (existingByEmailForm) {
      throw new ConflictException(
        `이메일 양식 '${createDto.emailForm}'이 이미 존재합니다.`,
      );
    }

    // BigInt 변환
    const pointPoolTotal = BigInt(createDto.pointPoolTotal);
    const pointPoolRemaining = createDto.pointPoolRemaining
      ? BigInt(createDto.pointPoolRemaining)
      : pointPoolTotal; // 기본값은 총 포인트와 동일

    const institution = await this.prisma.institutionConfig.create({
      data: {
        name: createDto.name,
        emailForm: createDto.emailForm,
        contactPersonName: createDto.contactPersonName,
        contactPersonPhone: createDto.contactPersonPhone,
        contactPersonEmail: createDto.contactPersonEmail,
        businessRegistrationNumber: createDto.businessRegistrationNumber,
        pointPoolTotal: pointPoolTotal,
        pointPoolRemaining: pointPoolRemaining,
        pointLimitPerUser: createDto.pointLimitPerUser,
        affiliationCodes: createDto.affiliationCodes as any, // JSON 타입으로 변환
      },
    });

    return this.mapToResponse(institution);
  }

  async findAll(): Promise<InstitutionConfigResponseDto[]> {
    const institutions = await this.prisma.institutionConfig.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return institutions.map((inst) => this.mapToResponse(inst));
  }

  async findOne(id: string): Promise<InstitutionConfigResponseDto> {
    const institution = await this.prisma.institutionConfig.findUnique({
      where: { id },
    });

    if (!institution) {
      throw new NotFoundException(`기관 설정을 찾을 수 없습니다. (ID: ${id})`);
    }

    return this.mapToResponse(institution);
  }

  async update(
    id: string,
    updateDto: UpdateInstitutionConfigDto,
  ): Promise<InstitutionConfigResponseDto> {
    const existing = await this.prisma.institutionConfig.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`기관 설정을 찾을 수 없습니다. (ID: ${id})`);
    }

    const updateData: any = {};

    // name이 있는 경우 업데이트 (중복 체크 포함)
    if (updateDto.name !== undefined) {
      // 다른 기관에 같은 이름이 있는지 확인
      const existingByName = await this.prisma.institutionConfig.findUnique({
        where: { name: updateDto.name },
      });
      if (existingByName && existingByName.id !== id) {
        throw new ConflictException(
          `기관명 '${updateDto.name}'이 이미 존재합니다.`,
        );
      }
      updateData.name = updateDto.name;
    }

    // pointPoolTotal이 있는 경우만 업데이트
    if (updateDto.pointPoolTotal !== undefined) {
      const newPointPoolTotal = BigInt(updateDto.pointPoolTotal);
      updateData.pointPoolTotal = newPointPoolTotal;

      // 포인트 총액이 변경되면 남은 포인트도 비율에 맞게 조정
      const currentRatio =
        Number(existing.pointPoolRemaining) / Number(existing.pointPoolTotal);
      updateData.pointPoolRemaining = BigInt(
        Math.floor(Number(newPointPoolTotal) * currentRatio),
      );
    }

    // pointLimitPerUser가 있는 경우만 업데이트
    if (updateDto.pointLimitPerUser !== undefined) {
      updateData.pointLimitPerUser = updateDto.pointLimitPerUser;
    }

    // 업데이트할 데이터가 없는 경우
    if (Object.keys(updateData).length === 0) {
      return this.mapToResponse(existing);
    }

    const updated = await this.prisma.institutionConfig.update({
      where: { id },
      data: updateData,
    });

    return this.mapToResponse(updated);
  }

  async remove(id: string): Promise<void> {
    const institution = await this.prisma.institutionConfig.findUnique({
      where: { id },
    });

    if (!institution) {
      throw new NotFoundException(`기관 설정을 찾을 수 없습니다. (ID: ${id})`);
    }

    await this.prisma.institutionConfig.delete({
      where: { id },
    });
  }

  private mapToResponse(
    institution: any,
  ): InstitutionConfigResponseDto {
    return {
      id: institution.id,
      name: institution.name,
      emailForm: institution.emailForm,
      contactPersonName: institution.contactPersonName,
      contactPersonPhone: institution.contactPersonPhone,
      contactPersonEmail: institution.contactPersonEmail,
      businessRegistrationNumber: institution.businessRegistrationNumber,
      pointPoolTotal: institution.pointPoolTotal.toString(),
      pointPoolRemaining: institution.pointPoolRemaining.toString(),
      pointLimitPerUser: institution.pointLimitPerUser,
      affiliationCodes: institution.affiliationCodes,
    };
  }
}

