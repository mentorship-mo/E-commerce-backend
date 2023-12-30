export interface User {
    id: string;
    password: string;
    email: string;
    name: string;
    oAuthToken?: "google" | "facebook";
    otp?: string;
  }
  