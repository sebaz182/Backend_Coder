import {messageModel} from './models/messageModel.js'

export class ChatManager {
    
    async getMessages() {
        return await messageModel.find().lean();
    }

    
    async getMessageBy(filter={}) {
        return await messageModel.findOne(filter).lean();
    }

    async addMessage(message) {
        return await messageModel.create(message);
    }
    
    async deleteMessage(filter={}){
        return await messageModel.findByIdAndDelete(filter);
    }

}

export default ChatManager