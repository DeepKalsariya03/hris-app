export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  data: {
    token: string;
    must_change_password: boolean;
  };
}

export interface DecodedToken {
  user_id: number;
  role: string;
  exp: number;
}
