
export interface User {
  id: string;
  password: string;
  email: string;
  name: string;
  verified: boolean;
  verificationToken?: string;
  oAuthToken?: "google" | "facebook";
  otp?: string;
  image: string;
}
export interface authenticatedRequest extends Request {
  [x: string]: any;
  user?:User;
}