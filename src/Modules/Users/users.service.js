import userModel from "../../DB/Models/users.model.js";
import {
  ConflictException,
  ErrorResponse,
  NotFoundException,
} from "../../Utils/Responses/error.response.js";
import { SuccessResponse } from "../../Utils/Responses/success.response.js";
import {
  findById,
  findByIdAndDelete,
  findByIdAndUpdate,
  findOne,
} from "../../DB/repo.DB.js";
import { decrypt, encrypt } from "../../Utils/Security/Encryption.js";

export const updateUser = async (req, res) => {
  const { password, ...newData } = req.body;

  // const { token } = req.headers;
  // const { userId } = await verifyToken({token});
  // const userExists = await findById({ model: userModel, id: userId });
  // if (!userExists) throw NotFoundException("User not found");
  const userId = req.decoded.id;
  console.log(req.decoded);

  // console.log(newData);
  if (newData.email) {
    const emailExists = await findOne({
      model: userModel,
      filter: { email: newData.email, _id: { $ne: userId } },
    });
    if (emailExists) throw ConflictException("Email already exists");
  }

  if (newData.phone) newData.phone = encrypt(newData.phone);

  const user = await findByIdAndUpdate({
    model: userModel,
    id: userId,
    data: newData,
    select: "name email age -_id",
  });

  SuccessResponse({
    res,
    statusCode: 200,
    message: "Updated",
    data: user,
  });
};

export const deleteUser = async (req, res) => {
  const userId = req.decoded.id;
  const user = await findByIdAndDelete({ model: userModel, id: userId });

  if (!user) throw NotFoundException("User Not found");

  SuccessResponse({
    res,
    statusCode: 200,
    message: "User deleted",
  });
};

export const getUser = async (req, res) => {
  const user = req.user;

  if (user.phone) user.phone = decrypt(user.phone);

  SuccessResponse({ res, statusCode: 200, message: "done", data: user });
};
