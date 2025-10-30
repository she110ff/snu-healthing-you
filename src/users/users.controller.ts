import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '사용자 생성', description: '새로운 사용자를 생성합니다.' })
  @ApiResponse({ status: 201, description: '사용자가 성공적으로 생성되었습니다.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: '사용자 목록 조회', description: '모든 사용자 목록을 조회합니다.' })
  @ApiResponse({ status: 200, description: '사용자 목록을 성공적으로 조회했습니다.' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '사용자 조회', description: '특정 사용자의 정보를 조회합니다.' })
  @ApiParam({ name: 'id', description: '사용자 ID', type: Number })
  @ApiResponse({ status: 200, description: '사용자 정보를 성공적으로 조회했습니다.' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '사용자 수정', description: '특정 사용자의 정보를 수정합니다.' })
  @ApiParam({ name: 'id', description: '사용자 ID', type: Number })
  @ApiResponse({ status: 200, description: '사용자 정보가 성공적으로 수정되었습니다.' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '사용자 삭제', description: '특정 사용자를 삭제합니다.' })
  @ApiParam({ name: 'id', description: '사용자 ID', type: Number })
  @ApiResponse({ status: 200, description: '사용자가 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
