import mongoose from "mongoose";



export interface ChatroomDocument extends mongoose.Document{
    name: string;
    description: string;
    ownerId: mongoose.Types.ObjectId;
    users: mongoose.Types.ObjectId[];
    createdAt: Date;
}

const chatroomSchema = new mongoose.Schema<ChatroomDocument>({
    name: {type: String, required: true},
    description: {type: String, required: false},
    ownerId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true},
    users: {type: [mongoose.Schema.Types.ObjectId], ref: "User", required: true, index: true},
    createdAt: {type: Date, required: true , default: Date.now()}
})

const ChatroomModel = mongoose.model<ChatroomDocument>(
    "Chatroom",
    chatroomSchema
)   

export default ChatroomModel;