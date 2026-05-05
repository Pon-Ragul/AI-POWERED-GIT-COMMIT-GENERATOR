export const userTypes = {
  User: {
    id: 'string',
    name: 'string',
    email: 'string',
    created_at: 'string'
  },
  LoginCredentials: {
    email: 'string',
    password: 'string'
  },
  SignupData: {
    name: 'string',
    email: 'string',
    password: 'string'
  },
  AuthResponse: {
    access_token: 'string',
    token_type: 'string',
    user: 'User'
  }
};
