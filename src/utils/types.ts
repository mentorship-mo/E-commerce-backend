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
