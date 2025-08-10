import {User} from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { uploadOnCloudinary } from '../utils/cloudinary.js';


const generateAccessTokenAndRefreshToken=async (userId) => {
    try{
        const user=await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return {accessToken, refreshToken: refreshToken};
    }
    catch(error) {
        console.error("Error generating tokens:", error);
        throw new Error("Token generation failed");
    }
}


const registerUser =  async (req, res) => {
   

    const {name, email, password } = req.body
    //console.log("email: ", email);

    if (
        [name, email, password].some((field) => field?.trim() === "")
    ) {
        return res.status(400).json({
            status: 400,
            message: "Name, email, and password are required"
        })
    }

    const existedUser = await User.findOne({
      email
    })


    if (existedUser) {
        return res.status(400).json({
            status: 400,
            message: "User with this email already exists"
        })

    }
    //console.log(req.files);



  let coverImageLocalPath = "";

if (req.file) {
  coverImageLocalPath = req.file.path;
}
    
    

  

  //  const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   

    const user = await User.create({

        
        coverImage: coverImage?.url || "",
        email, 
        password,
        name,
        })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        return res.status(500).json({
            status: 500,
            message: "User registration failed"
        })
    }

    return res.status(201).json(
        {
            status: 201,
            message: "User registered successfully",
            data: createdUser,
            ...await generateAccessTokenAndRefreshToken(user._id)
        }
    )



}



// const loginUser = async (req, res) => {
//     const {email, password} = req.body;

//     if ([email, password].some((field) => field?.trim() === "")) {
//         return res.status(400).json({
//             status: 400,
//             message: "Email and password are required"
//         });
//     }
//     const user=await User.find({email}).select("-refreshToken -password");
//     if(!user){
//         return res.status(404).json({
//             status: 404,
//             message: "User not found"
//         });
//     }


//     const isPasswordValid = await user.isPasswordCorrect(password);
//     if(!isPasswordValid){
//         return res.status(401).json({
//             status: 401,
//             message: "Invalid email or password"
//         });

//     }

//     const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user._id);
//     const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    

//     const option={
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production', // 
        
//     }
   
//     return res.status(200).cookie("refreshToken", refreshToken, option).cookie("accessToken", accessToken, option)
//     .json({
//         status: 200,
//         message: "User logged in successfully",
//         data: loggedInUser,
//         accessToken,
//         refreshToken
//     });

// }

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if ([email, password].some((field) => field?.trim() === "")) {
      return res.status(400).json({
        status: 400,
        message: "Email and password are required",
      });
    }

    // Find ONE user (not an array)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 401,
        message: "Invalid email or password",
      });
    }

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    // Fetch fresh user info without password or refreshToken
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json({
        status: 200,
        message: "User logged in successfully",
        data: loggedInUser,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};



const logoutUser = async(req, res) => {
      const updatedUser = await User.findByIdAndUpdate(
       req.user._id,
       { $unset: { refreshToken: "" } },
       { new: true }
     );

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("refreshToken",  options)
        .cookie("accessToken",  options)
        .json({
            status: 200,
            message: "User logged out successfully"
        })

}


const updateUserCoverImage = async(req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        return res.status(400).json({
            status: 400,
            message: "Cover image is not found"
        })
    }

    //TODO: delete old image - assignment


    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        return res.status(500).json({
            status: 500,
            message: "Failed to upload cover image"
        })
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        {
            status: 200,
            message: "Cover image updated successfully",
            data: user
        }
    )
}

const changeCurrentPassword = async(req, res) => {
    const {oldPassword, newPassword} = req.body

    

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        return res.status(401).json({
            status: 401,
            message: "Old password is incorrect"
        })
    }
    if (!newPassword || newPassword.trim() === "") {
        return res.status(400).json({
            status: 400,
            message: "New password is required"
        })
    }
    if (newPassword.length < 6) {
        return res.status(400).json({
            status: 400,
            message: "New password must be at least 6 characters long"
        })
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json({
        status: 200,
        message: "Password changed successfully"
    })
}

export{
    registerUser,
    loginUser,
    logoutUser,
    updateUserCoverImage,
    changeCurrentPassword
}