import {registerUserService,loginUserService,} from "../services/auth.service.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const registerUser = async (req, res) => {
  
  try {
    const {name, email, password } = req.body;
    const profileImage = req.file ? req.file.path.replace(/\\/g, "/") : "";
   console.log(name, email, password, profileImage);

    const result = await registerUserService({
      name,
      email,
      password,
      profileImage,
    });

    if (!password ) {
    return res.status(400).json({
        message: "Password is required"
    });
    }

    if (!name) {
    return res.status(400).json({
        message: "Password is required"
    });
    }

    if (!email) {
    return res.status(400).json({
        message: "Password is required"
    });
    }





    return successResponse(
      res,
      "User registered successfully.",
      result,
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const loginUser = async (req, res) => {
  try {
    const {email, password } = req.body;


    const result = await loginUserService(email, password);

    if (result.user && result.user.isBanned) {
      return res.status(403).json({ 
        success: false, 
        message: "Your account has been banned. Please contact support." 
      });
    }

    return successResponse(
      res,
      "Login successful.",
      result
    );
  } catch (error) {
    return errorResponse(res, error.message, 401);
  }
};