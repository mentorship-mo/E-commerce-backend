import { User } from "../types"

export interface userDAO {
    createUser(user : User) : Promise<void>
    getUserByEmail(email:string) : Promise<User|null>
    verifyEmail(verificationToken : string) : Promise<any>
}