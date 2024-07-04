import { ChatsMongoDAO as ChatsDAO } from "../DAO/ChatsMongoDAO.js"

class ChatsService{
    constructor(dao){
        this.dao = dao
    }

    getMessages = async()=>{
        return this.dao.getMessages()
    }

    getMessageBy = async(filter={})=>{
        return this.dao.getMessageBy(filter={})
    }

    addMessage = async(message)=>{
        return this.dao.addMessage(message)
    }
    
    deleteMessage = async(filter={})=>{
        return this.dao.deleteMessage(filter={})
    }

}

export const chatsService = new ChatsService(new ChatsDAO())