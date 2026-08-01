export type JWTPayloadType = {
  id: number;
  userType: string;
};
export interface UserType {
  id: number;
  username: string;
  email: string;
  password: string;
  userType: string;
  isAccountVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export type AuthReturnType = {
  user?: UserType;
  accessToken?: string;
  message?: string;
};
export interface AuthenticatedRequest extends Request {
  user: { id: number; userType: string };
}
