export type  User = {
  id: string;
  email: string;
  name: string;
  verified?: boolean;
  verificationToken?: string;
  enable2FAToken?:string;
  oAuthToken: String;
  authProvider : "Local" | "Google"
  otp?: string;
  image: string;
  addresses?: {
    street: string;
    city: string;
    zipCode: number;
  };
  is2FAEnabled?: boolean
}& (Google | Local)
interface Google  { 
  authProvider : "Google",
  oAuthToken : string
  password ?: string
}
interface Local { 
  authProvider : "Local",
  password : string
}

 
