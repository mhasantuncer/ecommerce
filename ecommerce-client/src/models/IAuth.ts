export interface ILoginResponse {
  user: {
    username: string;
  };
  expires_in: number;
  token: string;
}

export interface IAuthContext {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}
