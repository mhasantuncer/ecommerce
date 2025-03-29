// src/models/IAuth.ts
export interface ILoginResponse {
  user: {
    username: string;
  };
  expires_in: number; // Token expiry in seconds
  token: string; // JWT token
}

export interface IAuthContext {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}
