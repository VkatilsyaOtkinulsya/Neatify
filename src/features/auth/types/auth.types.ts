export interface AuthError {
  code: number;
  message: string;
  errors?: Array<{
    message: string;
    domain: string;
    reason: string;
  }>;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface UserData {
  displayName: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface UserInfo {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  avatar: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}
