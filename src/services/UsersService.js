import { UsersMongoDAO as UsersDAO } from "../DAO/UsersMongoDAO.js"

class UsersService{
    constructor(dao){
        this.dao = dao
    }

    addUser = async(user)=>{
        return this.dao.addUser(user)
    }

    getBy = async(filter={})=>{
        return this.dao.getBy(filter={})
    }

    getByPopu = async(filter={})=>{
        return this.dao.getByPopu(filter={})
    }

}

export const usersService = new UsersService(new UsersDAO())