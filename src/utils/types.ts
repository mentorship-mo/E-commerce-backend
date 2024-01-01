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
<<<<<<< HEAD
}


export interface Tokens {
  accessToken: string,
  refreshToken: string
}
=======
  is2FaEnabled : boolean
}
>>>>>>> f76e9c1a886e3f25bc8a1e0fe3ca23c27f687cac
