const User=require('../models/userModel');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {jwtSecret,jwtExpire}=require('../config/keys')


exports.signupController= async (req,res)=>{

    const {email,contact,username,password}=req.body;
    try{
        const user=  await User.findOne({email});
        if(user){
            return res.status(400).json({
                errorMessage:"Email already exists",
            });
        }
        const handle= await User.findOne({userName:username});
        if(handle){
            return res.status(400).json({
                errorMessage:"Username already exists",
            });
        }    
        const newUser=new User();
        newUser.email=email;
        newUser.contact=contact;
        newUser.userName=username;
        console.log(newUser.username);
        const salt= await bcrypt.genSalt(10);
        newUser.password= await bcrypt.hash(password,salt);
        //await newUser.save();
        await newUser.save((err)=>{
            if (err) console.log(err);
            else{
                console.log('user saved to database');
                res.json({
                    successMessage:'Registration successful.Please login.',
                });
            } 
        })
        
    }
    catch(err){
        //console.log('signupController error',err);
        res.status(500).json({
            errorMessage:'Server error',
        });
    }
};


exports.loginController= async (req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await User.findOne({email});
        if(!user){
            res.status(400).json({
                errorMessage:'User does not exists',
            });   
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            res.status(400).json({
                errorMessage:'Invalid credentials',
            });
            
        }
        const payload={
            user:{
                _id:user._id,
            },
        };
        //res.json({data:payload})
    
        jwt.sign(payload,jwtSecret,{expiresIn:jwtExpire},(err,token)=>{
            if(err) console.log('jwt error',err);
            //console.log('jwt successful');
            const {email,userName,friends,groups}= user;
            //console.log(userName)
            res.json({
                token,
                user:{email,userName,friends,groups},
            });


        });       

    }
    catch(err){
        //console.log('Login server error',err);
        res.status(400).json({
            errorMessage:'Server error',
        }); 
    }
};

