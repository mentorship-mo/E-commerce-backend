import { User } from "../types"

export interface userDAO {
    createUser(user : User) : Promise<void>
    getUserByEmail(email :string ) : Promise<User |null>
<<<<<<< HEAD
    // getUserById(id : string ) : Promise<User | null >
    // getUsers():Promise<User[]>
=======
>>>>>>> f76e9c1a886e3f25bc8a1e0fe3ca23c27f687cac
    getUserByEmail(email:string) : Promise<User|null>
    verifyEmail(verificationToken : string) : Promise<any>
}