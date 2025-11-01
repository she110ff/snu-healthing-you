export const userFixtures = {
  existing: {
    email: 'user2@snu.ac.kr',
    password: 'password',
    name: '사용자2',
    dateOfBirth: '1985-05-15',
    gender: 'FEMALE',
    height: 165.0,
    weight: 60.0,
    sido: '서울특별시',
    guGun: '강남구',
  },
  new: {
    email: 'newuser@snu.ac.kr',
    password: 'password123',
    name: '새사용자',
    emailVerificationCode: '123456',
    dateOfBirth: '1990-01-01',
    gender: 'MALE',
    height: 175.0,
    weight: 70.0,
    sido: '서울특별시',
    guGun: '종로구',
    organizationCode: 'SNU01',
  },
  invalid: {
    wrongEmail: {
      email: 'wrong@snu.ac.kr',
      password: 'password',
    },
    wrongPassword: {
      email: 'user2@snu.ac.kr',
      password: 'wrongpassword',
    },
  },
};


