import {
  Controller,
  Patch,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Request,
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
import { ApproveService } from './approve.service';
import { BatchApproveUsersDto } from './dto/batch-approve-users.dto';
import { BatchApproveUsersResponseDto } from './dto/batch-approve-users-response.dto';
import { ApproveUserResponseDto } from './dto/approve-user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('approve')
@Controller('approve')
export class ApproveController {
  constructor(private readonly approveService: ApproveService) {}

  @Patch('batch')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: '[관리자] 복수 사용자 배치 승인',
    description: '관리자가 여러 사용자의 가입을 한 번에 승인합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 승인 처리가 완료되었습니다.',
    type: BatchApproveUsersResponseDto,
  })
  @ApiBadRequestResponse({
    description: '잘못된 요청입니다. (빈 배열, 잘못된 UUID 형식 등)',
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요하거나 관리자 권한이 필요합니다.',
  })
  async batchApprove(
    @Body() batchApproveUsersDto: BatchApproveUsersDto,
    @Request() req: any,
  ): Promise<BatchApproveUsersResponseDto> {
    const adminId = req.user.id; // JWT에서 관리자 ID 추출
    return this.approveService.approveUsers(batchApproveUsersDto.ids, adminId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: '[관리자] 사용자 승인',
    description: '관리자가 사용자의 가입을 승인합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '승인할 사용자 ID (UUID)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '사용자가 성공적으로 승인되었습니다.',
    type: ApproveUserResponseDto,
  })
  @ApiBadRequestResponse({
    description: '이메일 인증이 완료되지 않았거나 이미 승인된 사용자입니다.',
  })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  @ApiUnauthorizedResponse({
    description: '인증이 필요하거나 관리자 권한이 필요합니다.',
  })
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ): Promise<ApproveUserResponseDto> {
    const adminId = req.user.id; // JWT에서 관리자 ID 추출
    return this.approveService.approveUser(id, adminId);
  }
}


