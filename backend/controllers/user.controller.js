import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js"
export const register = async(req, res) => {
    try {
        const {fullname, email, password, phoneNumber, role} = req.body;
       
        if(!fullname || !email || !password || !phoneNumber || !role){
            return res.status(400).json({
                message: "Something went wrong",
                success:false
            })
        };
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                message:'User exist with this email',

            })
        }
        const hashPassword = await bcrypt.hash(password, 10);
        await User.create({
            fullname,
            email,
            password:hashPassword,
            phoneNumber,
            role,
            profile:{
                profilePhoto:cloudResponse.secure_url,
            }
        });
        return res.status(201).json({
            message:"Account created successfully",
            success:true
        })
    } catch(error){
     console.log(error);
    }
}

// export const login = async (req, res)=> {
//     try{
//         const { email, password,  role} = req.body;
//         if(!email || !password  || !role){
//             return res.status(400).json({
//                 message: "Something went wrong",
//                 success:false
//             })
//         };
//         let user = await User.findOne({email});
//         if(!user){
//             return res.status(400).json({
//                 message: "Incorrect email or password",
//                 success:false,
//             })
//         }
//         const isPasswordMatch = await bcrypt.compare(password, user.password);
//         if(!isPasswordMatch){
//             return res.status(400).json({

//                 message:"Incorrct email or password",
//                 success:false
//             })
//         };
//         if(role !== user.role){
//             return res.status(400).json({
//                 message:"Account does not exist with current role",
//                 success:false
//             })
//         }

//         const tokenData = {
//             userId: user._id
//         }
//         const token  = await jwt.sign(tokenData, process.env.SECRET_KEY,{expiresIn:'1d'});
//         user = {
//             _id: user._id,
//             fullname: user.fullname,
//             email: user.email,
//             phoneNumber: user.phoneNumber,
//             role: user.role,
//             profile: user.profile
//         }
       
//         return res.status(200).cookie("token", token, {maxAge:1*24*60*60*1000, httpsOnly:true, sameSite:'strict'}).json({
//             message:`Welcome back ${user.fullname}`,
//             user,
//             success:true
//         })
//     }catch(error){
//        console.log(error);
//     }
// }

// export const logout = async(req, res) => {
//     try{
//       return res.status(200).cookie("token","", {maxAge:0}).json({
//         message:"Logged out successfully",
//         success:true
//       })
//     }catch(error){
//       console.log(error);
//     }
// }
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Log to check the login request
    console.log("Login request received:", { email, role });

    // Check if user exists based on email
    let user = await User.findOne({ email });
    
    if (!user) {
      console.log("User not found with email:", email); // Log for missing user
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    
    if (!isPasswordMatch) {
      console.log("Password mismatch for user:", email); // Log for wrong password
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    // Log to check the stored role vs the role from the client
    console.log("Stored role:", user.role, "Requested role:", role);

    // Compare the role
    if (role !== user.role) {
      console.log("Role mismatch. Stored role:", user.role, "Requested role:", role); // Log role mismatch
      return res.status(400).json({
        message: "Account does not exist with the current role",
        success: false,
      });
    }

    // Create token
    const tokenData = { userId: user._id };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // Prepare user data to send back
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    console.log("Login successful for user:", user.fullname); // Log successful login

    // Set the cookie and send response
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });

  } catch (error) {
    console.log("Error during login process:", error); // Log any caught errors
    return res.status(500).json({
      message: "Login failed",
      success: false,
    });
  }
};


  
export const logout = async (req, res) => {
    try {
      return res
        .status(200)
        .cookie("token", "", { maxAge: 0, httpOnly: true })
        .json({
          message: "Logged out successfully",
          success: true,
        });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Logout failed",
        success: false,
      });
    }
  };
  

export const updateProfile = async(req,res)=>{
    try{
        const {fullname, email, bio, phoneNumber, skills} = req.body;
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content,{
            resource_type:"raw"
        });
        console.log(cloudResponse);
        let skillsArray;
        if(skills){
         skillsArray = skills.split(",");
        }
        const userId = req.id;
        let user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                message:'User not found',
                success:false
            })
        }

       if(fullname) user.fullname = fullname
       if(email) user.email = email
       if(phoneNumber) user.phoneNumber = phoneNumber
       if(bio) user.profile.bio = bio
       if(skills) user.profile.skills = skillsArray
       
       if(cloudResponse){
         user.profile.resume = cloudResponse.secure_url
         
        user.profile.resumeOriginalName = file.originalname
         
    }
        await user.save();

        user = {
            _id:user._id,
            fullname:user.fullname,
            phoneNumber: user.phoneNumber,
            email:user.email,
            role:user.role,
            profile:user.profile
        }
       return res.status(200).json({
        message:"Pofile updated successfully",
        user,
        success:true
       })

    }catch(error){
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({
            message: "Resume upload failed",
            success: false
    })
}

}