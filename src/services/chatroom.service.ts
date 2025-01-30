import ChatroomModel from "../models/chatroom.model";


export type CreateChatroomParams = {
    name: string,
    ownerId: string,
    description?: string,
    users: string[]
}

export const createChatroom = async (data:CreateChatroomParams) => {
    const chatroom = await ChatroomModel.create({
        name: data.name,
        description: data.description,
        ownerId: data.ownerId,
        users: data.users
    })
    return chatroom
}