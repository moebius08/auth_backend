import mongoose from "mongoose";

export interface MessageDocument extends mongoose.Document{
    userId: mongoose.Types.ObjectId;
    chatroomId: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
}


const messageSchema = new mongoose.Schema<MessageDocument>({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true},
    chatroomId: {type: mongoose.Schema.Types.ObjectId, ref: "Chatroom", required: true, index: true},
    content: {type: String, required: true},
    createdAt: {type: Date, required: true , default: Date.now()}
})

const MessageModel = mongoose.model<MessageDocument>(
    "Message",
    messageSchema
)

export default MessageModel;