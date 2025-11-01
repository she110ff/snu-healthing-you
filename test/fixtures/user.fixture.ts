export const userFixtures = {
  existing: {
    email: 'user2@snu.ac.kr',
    password: 'password',
    name: '사용자2',
    dateOfBirth: '1985-05-15',
    gender: 'FEMALE',
    height: 165.0,
    weight: 60.0,
    sidoCode: '11',
    guGunCode: '11680',
  },
  new: {
    email: 'newuser@snu.ac.kr',
    password: 'password123',
    name: '새사용자',
    dateOfBirth: '1990-01-01',
    gender: 'MALE',
    height: 175.0,
    weight: 70.0,
    sidoCode: '11',
    guGunCode: '11110',
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


