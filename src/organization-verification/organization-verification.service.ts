import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class OrganizationVerificationService {
  private readonly validOrganizationCodes = ['SNU01', 'SNU02'];

  /**
   * 조직 코드 검증
   */
  verifyOrganizationCode(organizationCode: string): boolean {
    if (!this.validOrganizationCodes.includes(organizationCode)) {
      throw new BadRequestException(
        '조직 코드는 SNU01 또는 SNU02 중 하나여야 합니다.',
      );
    }
    return true;
  }
}

