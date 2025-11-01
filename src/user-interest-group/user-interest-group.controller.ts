import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UserInterestGroupService } from './user-interest-group.service';
import { CreateUserInterestGroupDto } from './dto/create-user-interest-group.dto';
import { UpdateUserInterestGroupDto } from './dto/update-user-interest-group.dto';
import { UserInterestGroupResponseDto } from './dto/user-interest-group-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('user-interest-group')
@Controller('user-interest-group')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
export class UserInterestGroupController {
  constructor(
    private readonly userInterestGroupService: UserInterestGroupService,
  ) {}

  @Post()
  @ApiOperation({
    summary: '사용자 관심 그룹 생성 또는 업데이트',
    description:
      '사용자 관심 그룹을 생성하거나 이미 존재하는 경우 업데이트합니다. 사용자당 하나의 관심 그룹만 존재합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '사용자 관심 그룹이 성공적으로 생성되었습니다.',
    type: UserInterestGroupResponseDto,
  })
  @ApiBadRequestResponse({
    description: '잘못된 요청입니다.',
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  @ApiNotFoundResponse({
    description: '학습 컨텐츠 그룹을 찾을 수 없습니다.',
  })
  create(
    @Request() req: any,
    @Body() createUserInterestGroupDto: CreateUserInterestGroupDto,
  ): Promise<UserInterestGroupResponseDto> {
    const userId = req.user.id;
    return this.userInterestGroupService.createOrUpdate(
      userId,
      createUserInterestGroupDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: '사용자 관심 그룹 조회',
    description: '현재 사용자의 관심 그룹을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 관심 그룹을 성공적으로 조회했습니다.',
    type: UserInterestGroupResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  findOne(@Request() req: any): Promise<UserInterestGroupResponseDto | null> {
    const userId = req.user.id;
    return this.userInterestGroupService.findOne(userId);
  }

  @Patch()
  @ApiOperation({
    summary: '사용자 관심 그룹 수정',
    description: '현재 사용자의 관심 그룹을 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 관심 그룹이 성공적으로 수정되었습니다.',
    type: UserInterestGroupResponseDto,
  })
  @ApiNotFoundResponse({
    description: '사용자 관심 그룹 또는 학습 컨텐츠 그룹을 찾을 수 없습니다.',
  })
  @ApiBadRequestResponse({
    description: '잘못된 요청입니다.',
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  update(
    @Request() req: any,
    @Body() updateUserInterestGroupDto: UpdateUserInterestGroupDto,
  ): Promise<UserInterestGroupResponseDto> {
    const userId = req.user.id;
    return this.userInterestGroupService.update(userId, updateUserInterestGroupDto);
  }

  @Delete()
  @ApiOperation({
    summary: '사용자 관심 그룹 삭제',
    description: '현재 사용자의 관심 그룹을 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 관심 그룹이 성공적으로 삭제되었습니다.',
  })
  @ApiNotFoundResponse({
    description: '사용자 관심 그룹을 찾을 수 없습니다.',
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  remove(@Request() req: any): Promise<void> {
    const userId = req.user.id;
    return this.userInterestGroupService.remove(userId);
  }
}

