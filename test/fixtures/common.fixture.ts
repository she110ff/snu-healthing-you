export const commonFixtures = {
  organizationCodes: {
    valid: ['SNU01', 'SNU02'],
    invalid: ['INVALID', 'SNU99', ''],
  },
  emailVerification: {
    validCode: '123456',
    invalidCode: '000000',
    expiredCode: '999999',
  },
  uuids: {
    valid: '123e4567-e89b-12d3-a456-426614174000',
    invalid: 'invalid-uuid',
    nonExistent: '00000000-0000-0000-0000-000000000000',
  },
};


