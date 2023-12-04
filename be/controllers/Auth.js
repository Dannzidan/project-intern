import argon2 from "argon2";
import User from "../models/UserModel.js";
import { jwtSign } from "../middleware/AuthUser.js";

export const Login = async (req, res) =>{
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });

    
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    
    const match = await argon2.verify(user.password, req.body.password);
    if(!match) return res.status(400).json({msg: "Wrong Password"});

    const token = await jwtSign({
        id    : user.id,
        uuid  : user.uuid,
        name  : user.name,
        email : user.email,
        role  : user.role
    })

    res.status(200).json({
        token : token
    });
}

export const Me = async (req, res) =>{
    if(!req.userId){
        return res.status(401).json({msg: "Mohon login ke akun Anda!"});
    }
    const user = await User.findOne({
        attributes:['id','uuid','name','email','role'],
        where: {
            uuid: req.uuid
        }
    });
    
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    res.status(200).json(user);
}

export const logOut = (req, res) =>{
    req.destroy((err)=>{
        if(err) return res.status(400).json({msg: "Tidak dapat logout"});
        res.status(200).json({msg: "Anda telah logout"});
    });
}