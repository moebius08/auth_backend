import { HTTP_STATUS } from "../constants/http";
import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";

export const getUserHandler = catchErrors(async (req, res) => {
  const user = await UserModel.findById(req.userId);
  appAssert(user, HTTP_STATUS.NOT_FOUND, "User not found");
  return res.status(HTTP_STATUS.OK).json(user.omitPassword());
});