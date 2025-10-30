import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InstitutionConfigService } from './institution-config.service';
import { CreateInstitutionConfigDto } from './dto/create-institution-config.dto';
import { UpdateInstitutionConfigDto } from './dto/update-institution-config.dto';
import { InstitutionConfigResponseDto } from './dto/institution-config-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('institution-config')
@Controller('admin/institution-config')
export class AdminInstitutionConfigController {
  constructor(
    private readonly institutionConfigService: InstitutionConfigService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: '[관리자] 기관 설정 목록 조회',
    description: '모든 기관 설정 목록을 조회합니다. 관리자만 접근 가능합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '기관 설정 목록을 성공적으로 조회했습니다.',
    type: [InstitutionConfigResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: '인증이 필요합니다.',
  })
  @ApiResponse({
    status: 403,
    description: '관리자 권한이 필요합니다.',
  })
  async findAll(): Promise<InstitutionConfigResponseDto[]> {
    return this.institutionConfigService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: '[관리자] 기관 설정 조회',
    description: 'ID로 특정 기관 설정을 조회합니다. 관리자만 접근 가능합니다.',
  })
  @ApiParam({ name: 'id', description: '기관 설정 ID (UUID)', type: String })
  @ApiResponse({
    status: 200,
    description: '기관 설정을 성공적으로 조회했습니다.',
    type: InstitutionConfigResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '기관 설정을 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: 401,
    description: '인증이 필요합니다.',
  })
  @ApiResponse({
    status: 403,
    description: '관리자 권한이 필요합니다.',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<InstitutionConfigResponseDto> {
    return this.institutionConfigService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: '[관리자] 기관 설정 생성',
    description: '새로운 기관 설정을 생성합니다. 관리자만 접근 가능합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '기관 설정이 성공적으로 생성되었습니다.',
    type: InstitutionConfigResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청입니다.',
  })
  @ApiResponse({
    status: 409,
    description: '이미 존재하는 기관명 또는 이메일 양식입니다.',
  })
  @ApiResponse({
    status: 401,
    description: '인증이 필요합니다.',
  })
  @ApiResponse({
    status: 403,
    description: '관리자 권한이 필요합니다.',
  })
  async create(
    @Body() createDto: CreateInstitutionConfigDto,
  ): Promise<InstitutionConfigResponseDto> {
    return this.institutionConfigService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: '[관리자] 기관 설정 수정',
    description: '특정 기관 설정을 수정합니다. 관리자만 접근 가능합니다.',
  })
  @ApiParam({ name: 'id', description: '기관 설정 ID (UUID)', type: String })
  @ApiResponse({
    status: 200,
    description: '기관 설정이 성공적으로 수정되었습니다.',
    type: InstitutionConfigResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '기관 설정을 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: 401,
    description: '인증이 필요합니다.',
  })
  @ApiResponse({
    status: 403,
    description: '관리자 권한이 필요합니다.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateInstitutionConfigDto,
  ): Promise<InstitutionConfigResponseDto> {
    return this.institutionConfigService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearer')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '[관리자] 기관 설정 삭제',
    description: '특정 기관 설정을 삭제합니다. 관리자만 접근 가능합니다.',
  })
  @ApiParam({ name: 'id', description: '기관 설정 ID (UUID)', type: String })
  @ApiResponse({
    status: 204,
    description: '기관 설정이 성공적으로 삭제되었습니다.',
  })
  @ApiResponse({
    status: 404,
    description: '기관 설정을 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: 401,
    description: '인증이 필요합니다.',
  })
  @ApiResponse({
    status: 403,
    description: '관리자 권한이 필요합니다.',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.institutionConfigService.remove(id);
  }
}
