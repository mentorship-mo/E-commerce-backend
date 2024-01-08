export type  User = {
  id: string;
  email: string;
  name: string;
  verified?: boolean;
  verificationToken?: string;
  oAuthToken: String;
  authProvider : "Local" | "Google"
  otp?: string;
  image: string;
  is2FaEnabled ?: boolean
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

 
