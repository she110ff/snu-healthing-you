import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { OrganizationVerificationService } from './organization-verification.service';
import { VerifyOrganizationCodeDto } from './dto/verify-organization-code.dto';
import { VerifyOrganizationCodeResponseDto } from './dto/verify-organization-code-response.dto';

@ApiTags('organization-verification')
@Controller('organization-verification')
export class OrganizationVerificationController {
  constructor(
    private readonly organizationVerificationService: OrganizationVerificationService,
  ) {}

  @Post('verify-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '조직 코드 검증',
    description: '조직 코드(SNU01 또는 SNU02)를 검증합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '조직 코드 검증이 완료되었습니다.',
    type: VerifyOrganizationCodeResponseDto,
  })
  @ApiBadRequestResponse({
    description: '잘못된 조직 코드입니다.',
  })
  async verifyCode(
    @Body() dto: VerifyOrganizationCodeDto,
  ): Promise<VerifyOrganizationCodeResponseDto> {
    this.organizationVerificationService.verifyOrganizationCode(
      dto.organizationCode,
    );
    return {
      verified: true,
      message: '조직 코드 검증이 완료되었습니다.',
    };
  }
}

