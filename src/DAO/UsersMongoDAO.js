import {userModel} from '../models/usersModel.js'

export class UsersMongoDAO {

    //Add User
    async addUser(user){
        try {
            return await userModel.create(user);
        } catch (error) {
            console.log(error)
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                }
            )
        } 
    }

    //Obtener Usuario por filtro
    async getBy(filter={}){
        try {
            return await userModel.findOne(filter).lean()
        } catch (error) {
            console.log(error)
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                }
            )
        } 
    }

    //Obtener Usuario por filtro mas populate
    async getByPopu(filter={}){
        try {
            return await userModel.findOne(filter).populate("cart").lean()
        } catch (error) {
            console.log(error)
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                }
            )
        } 
    }
}

export default UsersMongoDAO