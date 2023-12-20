export interface User {
  id: string;
  password: string;
  email: string;
  name: string;
  verified: boolean;
  oAuthToken?: "google" | "facebook";
  otp?: string;
}
