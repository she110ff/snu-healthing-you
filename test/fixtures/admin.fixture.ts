export const adminFixtures = {
  valid: {
    name: '관리자',
    password: 'password',
  },
  invalid: {
    wrongName: {
      name: '잘못된관리자',
      password: 'password',
    },
    wrongPassword: {
      name: '관리자',
      password: 'wrongpassword',
    },
  },
};


