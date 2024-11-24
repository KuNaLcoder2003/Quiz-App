require('dotenv').config();
const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken')
const { Users , Quiz , Marks } = require('../db')
const {signin_schema , signup_schema} = require('../types')
const STATUS_CODES = require('../codes')
const JWT_KEY = process.env.KEY;
const bcrypt = require('bcrypt');
const saltRounds = 10;


router.post('/signup' , async(req, res) => {
    // route handler for signing up the user
    const user_deatils = req.body;
    const {first_name , last_name , username , password , avvatar} = user_deatils;
    try {
        const {success} = signup_schema.safeParse(user_deatils)
        if(!success){
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message : 'Invalid Inputs'
            })
        }

        const user_exists = await Users.findOne({username : username})

        if(user_exists) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message : 'User already Exists , try Logging In'
            })
        }
        const hashed_password = await bcrypt.hash(password , saltRounds)
        const new_user = new Users({
            first_name : first_name,
            last_name : last_name,
            username : username,
            password : hashed_password,
            avvatar_url : avvatar
        })
        await new_user.save()
        const token = jwt.sign({id : new_user._id} , JWT_KEY)
        res.status(STATUS_CODES.OK).json({
            token : token,
            message : 'Account created successfully'
        })
        
    } catch (error) {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message : 'Something went wrong'
        })
    }
})

router.post('/signin' , async(req, res)=> {
    // route handler for signin
    const user_credentials = req.body;
    const {username , password } = user_credentials;

    try {
        const {success} = signin_schema.safeParse(user_credentials);
        if(!success) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message : 'Invalid Input Types'
            })
        }
        

        const user = await Users.findOne({ username : username})

        if(!user){
            return res.status(STATUS_CODES.PERMISSION_DENIED).json({
                message : 'User does not exists'
            })
        }

        const isPasswordValid = await bcrypt.compare(password , user.password);
        if (!isPasswordValid) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                message: 'Invalid password',
            });
        }

        const token = jwt.sign({ id : user._id} , JWT_KEY)

        res.status(STATUS_CODES.OK).json({
            message : 'Successfuly logged In'
        })
    } catch (error) {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message : 'Something went wrong'
        })
    }
})


module.exports = router
