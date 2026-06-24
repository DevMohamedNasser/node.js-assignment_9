import { OAuth2Client } from "google-auth-library";
import userModel from "../../DB/Models/users.model.js";
import { create, findOne } from "../../DB/repo.DB.js";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "../../Utils/Responses/error.response.js";
import { SuccessResponse } from "../../Utils/Responses/success.response.js";
import { encrypt } from "../../Utils/Security/Encryption.js";
import { compareHash, hashing } from "../../Utils/Security/Hashing.js";
import { getNewLoginCredentials } from "../../Utils/Security/Token.js";
import { CLIENT_ID } from "../../Config/config.service.js";
import { ProviderEnum } from "../../Utils/enums/users.enum.js";

export const signup = async (req, res, next) => {
  const { name, email, password, phone, age } = req.body;

  const isExists = await findOne({ model: userModel, filter: { email } });
  if (isExists) throw ConflictException("Email already exists");

  const hashedPassword = await hashing(password);
  const encryptedPhone = await encrypt(phone);

  const user = await create({
    model: userModel,
    data: [
      { name, email, password: hashedPassword, phone: encryptedPhone, age },
    ],
  });

  SuccessResponse({
    res,
    statusCode: 201,
    message: "User created successfully",
    data: user,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findOne({ model: userModel, filter: { email } });
  if (!user) throw NotFoundException("User not found");

  const isAuthenticated = await compareHash(password, user.password);
  if (!isAuthenticated)
    throw UnauthorizedException("Invalid email or password");

  const token = getNewLoginCredentials(user);

  SuccessResponse({
    res,
    statusCode: 200,
    message: "Login successful",
    data: token,
  });
};

export const refreshToken = async (req, res) => {
  const tokens = await getNewLoginCredentials(req.user);
  SuccessResponse({
    res,
    statusCode: 200,
    message: "done",
    data: { accessToken: tokens.accessToken },
  });
};

async function verifyGoogleAcc({ idToken }) {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

export const googleLogin = async (req, res) => {
  const { idToken } = req.body;
  //   const payload = await verifyGoogleAcc({ idToken });
  //   console.log("payload", payload);

  const { email, email_verified, name, picture } = await verifyGoogleAcc({
    idToken,
  });

  const user = await findOne({ model: userModel, filter: { email } });

  if (!email_verified) throw BadRequestException("email not verified");

  if (user) {
    if (user.provider == ProviderEnum.Google) {
      const tokens = await getNewLoginCredentials(user);

      SuccessResponse({
        res,
        statusCode: 200,
        message: "Login successfully",
        data: tokens,
      });
    }
  } else {
    const newUser = await create({
      model: userModel,
      data: [
        {
          email,
          name,
          picture,
          provider: ProviderEnum.Google,
        },
      ],
    });
    const tokens = await getNewLoginCredentials(newUser);

    SuccessResponse({
      res,
      statusCode: 201,
      message: "Login successfully",
      data: tokens,
    });
  }
};

/*
payload {
  iss: 'https://accounts.google.com',
  azp: '656994246836-jp8n7qd86ploq2sqb67t952a4oc7pm7m.apps.googleusercontent.com',
  aud: '656994246836-jp8n7qd86ploq2sqb67t952a4oc7pm7m.apps.googleusercontent.com',
  sub: '114135467316406516977',
  email: 'm.nasser.dev@gmail.com',
  email_verified: true,
  nbf: 1782254840,
  name: 'Mohamed Nasser',
  picture: 'https://lh3.googleusercontent.com/a/ACg8ocKbEHRU1rZnCdc4jdHI6MHuSMSIixA4X8SjuxUKkeHZLWF-tA=s96-c',
  given_name: 'Mohamed',
  family_name: 'Nasser',
  iat: 1782255140,
  exp: 1782258740,
  jti: 'b54f0c4f6b1405bb01d04c5899d85687ea7683c6'
} 
*/
