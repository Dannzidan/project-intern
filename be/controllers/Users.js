import User from "../models/UserModel.js";
import Task from "../models/TaskModel.js";
import argon2 from "argon2";
import {Op} from "sequelize";

export const getUsers = async(req, res) =>{
    try {
        const response = await User.findAll({
            attributes:['uuid','name','email','role']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getUsersOption = async(req, res) =>{
    try {
		const { rolem,roles } = req.query;
        const whereClauseM = rolem ? { role: rolem } : {};
        const whereClauseS = roles ? { role: roles } : {};
		
        const moderator = await User.findAll({
            attributes:['id','name'],
            where: whereClauseM,
            //group: ['role'],
            raw: true 
        });
		
        const supplier = await User.findAll({
            attributes:['id','name'],
            where: whereClauseS,
            raw: true 
        });
		
		const resultArray = {
			moderator: moderator,
            supplier: supplier
        };

        res.status(200).json(resultArray);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getUserById = async(req, res) =>{
    try {
        const response = await User.findOne({
            attributes:['uuid','name','email','role'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createUser = async(req, res) =>{
    const {name, email, password, confPassword, role} = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    const hashPassword = await argon2.hash(password);

    try {
        await User.create({
            name        : name,
            email       : email,
            password    : hashPassword,
            role        : role
        });
        res.status(201).json({msg: "Register Berhasil"});

    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const updateUser = async(req, res) =>{
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    const {name, email, password, confPassword, role} = req.body;
    let hashPassword;
    if(password === "" || password === null){
        hashPassword = user.password
    }else{
        hashPassword = await argon2.hash(password);
    }
    if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    try {
        await User.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        },{
            where:{
                id: user.id
            }
        });
		await Task.update(
			{ assigned_mod: user.id+'-'+name },
			{
				where: {
					assigned_mod: {
						[Op.like]: user.id+'-%'
					}
				}
			}
		);
		await Task.update(
			{ assigned_sup: user.id+'-'+name },
			{
				where: {
					assigned_sup: {
						[Op.like]: user.id+'-%'
					}
				}
			}
		);
        res.status(200).json({msg: "User Updated"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const deleteUser = async(req, res) =>{
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    try {
        await User.destroy({
            where:{
                id: user.id
            }
        });

        if (!req.body.confirmation) {
            return res.status(200).json({ msg: "User deletion requires confirmation" });
          }
          
        res.status(200).json({msg: "User Deleted"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}