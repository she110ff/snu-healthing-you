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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserResponseDto } from './dto/delete-user-response.dto';
import { UserStatusResponseDto } from './dto/user-status-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({
    summary: '회원가입',
    description: '이메일 인증코드를 포함하여 새 사용자를 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '회원가입이 성공적으로 완료되었습니다.',
  })
  @ApiBadRequestResponse({
    description: '잘못된 요청입니다. (인증코드 오류 등)',
  })
  @ApiConflictResponse({
    description: '이미 가입된 이메일입니다.',
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: '사용자 목록 조회',
    description: '삭제되지 않은 모든 사용자 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 목록을 성공적으로 조회했습니다.',
  })
  @ApiResponse({
    status: 401,
    description: '인증이 필요합니다.',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: '사용자 상태 조회',
    description: '특정 사용자의 이메일 인증 및 관리자 승인 상태를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '사용자 ID (UUID)', type: String })
  @ApiResponse({
    status: 200,
    description: '사용자 상태를 성공적으로 조회했습니다.',
    type: UserStatusResponseDto,
  })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  async getStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserStatusResponseDto> {
    return this.usersService.getUserStatus(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: '사용자 조회',
    description: '특정 사용자의 정보를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '사용자 ID (UUID)', type: String })
  @ApiResponse({
    status: 200,
    description: '사용자 정보를 성공적으로 조회했습니다.',
  })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  @ApiResponse({ status: 410, description: '사용자가 이미 삭제되었습니다.' })
  @ApiResponse({
    status: 401,
    description: '인증이 필요합니다.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: '사용자 수정',
    description: '특정 사용자의 정보를 수정합니다. 수정 가능한 필드: 생년월일, 성별, 키, 몸무게, 시도, 구군',
  })
  @ApiParam({ name: 'id', description: '사용자 ID (UUID)', type: String })
  @ApiResponse({
    status: 200,
    description: '사용자 정보가 성공적으로 수정되었습니다.',
  })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  @ApiResponse({ status: 410, description: '사용자가 이미 삭제되었습니다.' })
  @ApiResponse({
    status: 401,
    description: '인증이 필요합니다.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: '사용자 삭제',
    description:
      '특정 사용자를 소프트 삭제합니다. deletedAt 필드가 설정되어 실제로는 데이터베이스에서 제거되지 않습니다.',
  })
  @ApiParam({ name: 'id', description: '사용자 ID (UUID)', type: String })
  @ApiResponse({
    status: 200,
    description: '사용자가 성공적으로 삭제되었습니다.',
    type: DeleteUserResponseDto,
  })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  @ApiResponse({ status: 410, description: '사용자가 이미 삭제되었습니다.' })
  @ApiResponse({
    status: 401,
    description: '인증이 필요합니다.',
  })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DeleteUserResponseDto> {
    return this.usersService.remove(id);
  }
}
