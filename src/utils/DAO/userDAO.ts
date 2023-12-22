import { User } from "../types"

export interface userDAO {
    createUser(user : User) : Promise<void>
    getUserByEmail(email :string ) : Promise<User |null>
    // getUserById(id : string ) : Promise<User | null >
    // getUsers():Promise<User[]>
}