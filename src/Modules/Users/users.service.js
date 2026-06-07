import userModel from "../../DB/Models/users.model.js";
import { decrypt, encrypt } from "../../Utils/Encryption.js";
import { compareHash, hashing } from "../../Utils/Hashing.js";
import { decodeToken, getToken } from "../../Utils/Token.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, phone, age } = req.body;

    const isExists = await userModel.findOne({ email });
    if (isExists)
      return res.status(409).json({ message: "Email already exists!!!" });

    const hashedPassword = await hashing(password);
    const encryptedPhone = await encrypt(phone);

    // const decryptedPhone = await decrypt(
    //   encryptedPhone.encryptedData,
    //   encryptedPhone.iv,
    // );
    // console.log(encryptedPhone, "encrypted phone");
    // console.log(decryptedPhone, "decrypted phone");

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      phone: encryptedPhone.encryptedData,
      phoneIV: encryptedPhone.iv,
      age,
    });

    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User Not found!!!" });
    const isAuthenticated = await compareHash(password, user.password);
    if (!isAuthenticated)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = await getToken({ userId: user._id });

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { password, ...newData } = req.body;
    const { token } = req.headers;
    const { userId } = await decodeToken(token);

    const userExists = await userModel.findById(userId);
    if (!userExists) return res.status(404).json({ message: "User not found" });

    console.log(newData);
    if (newData.email) {
      const emailExists = await userModel.findOne({
        email: newData.email,
        _id: { $ne: userId },
      });
      if (emailExists)
        return res.status(409).json({ message: "Email already exists" });
    }

    if (newData.phone) {
      const encryptedPhone = await encrypt(newData.phone);

      newData.phone = encryptedPhone.encryptedData;
      newData.phoneIV = encryptedPhone.iv;

      //   const decryptedPhone = await decrypt(
      //     encryptedPhone.encryptedData,
      //     encryptedPhone.iv,
      //   );
      //   console.log(decryptedPhone, "decrypted phone");
    }
    const user = await userModel
      .findByIdAndUpdate(
        userId,
        { $set: { ...newData }, $inc: { __v: 1 } },
        { runValidators: true, returnDocument: "after" },
      )
      .select("name email age -_id");

    return res.status(200).json({ message: "Updated", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { token } = req.headers;
    const { userId } = await decodeToken(token);

    const user = await userModel.findByIdAndDelete(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { token } = req.headers;
    const { userId } = await decodeToken(token);

    const user = await userModel.findById(userId).select("name email age -_id");

    if (!user)
        return res.status(404).json({message: "User not found"});

    return res.status(200).json({message: "done", user});
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
