import { HTTP_STATUS } from "../constants/http";
import ChatroomModel from "../models/chatroom.model";
import catchErrors from "../utils/catchErrors";

export const getChatroomsHandler = catchErrors(async (req, res) => {
    const chatrooms = await ChatroomModel.find(req.userId); 
    return res.status(HTTP_STATUS.OK).json(chatrooms);
});

export const getSingleChatroomHandler = catchErrors(async (req, res) => {
    const chatroom = await ChatroomModel.findById(req.params.id);
    return res.status(HTTP_STATUS.OK).json(chatroom);
});

// export const createChatroomHandler = catchErrors(async (req, res) => {
//     const request = 
// });