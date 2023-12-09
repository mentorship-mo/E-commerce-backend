import { userDAO } from "../../utils/DAO/userDAO";
import { User } from "../../utils/types";
import {Model} from 'mongoose'
import userModel from './user.model'

class userRepo implements userDAO {
    private model : Model<User>

    constructor(model : Model<User>){
        this.model = model
    }
    createUser(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getUserByEmail(email: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
    getUserById(id: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
    getUsers(): Promise<User[]> {
        throw new Error("Method not implemented.");
    }
}

export const db = new userRepo(userModel)