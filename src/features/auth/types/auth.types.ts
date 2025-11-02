export interface LoginCredentials {
  email: string;
  password: string;
}

export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}
