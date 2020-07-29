const express=require('express');
const router=express.Router();

const Messages=require('../models/messageModel');
const User=require('../models/userModel');

const {signupValidator,resultValidator}=require('../controller/validator')
const {signupController,loginController}=require('../controller/authController');


router.post('/signup',signupValidator,resultValidator,signupController);
router.post('/login',signupValidator,resultValidator,loginController);

router.post('/details',(req,res)=>{
    console.log(req.body);
    User.findOne({userName:req.body.username},(err,user)=>{
        if(err) console.log(err)
        res.json({user});
    })
})

router.post('/chats',(req,res)=>{
    const{sender,receiver}=req.body;
    if(req.body.type){
        Messages.find({receiver},(err,messages)=>{
            if (err) console.log('server group msg error-',err);
            res.json({messages});
        })
    }
    else{
        Messages.find({$or:[ { $and:[{sender:sender},{receiver:receiver}] },
            {$and:[{sender:receiver},{receiver:sender}]} ]},
        (err,messages)=>{
            if (err) console.log('server messages-',err);
            console.log('1-1 msg');
            res.json({messages})
        })
    }    
})

router.post('/searchFriends',(req,res)=>{
    console.log('add friends server',req.body);
    const searchTerm=req.body.queryField;
    
    User.find({"$text":{ "$search":searchTerm }})
    .exec((err,friends)=>{
        if(err) console.log(err)
        console.log('add friends',friends);
        res.json({friends})
    })    
})

router.post('/addFriends',(req,res)=>{
    const{myName,friend}=req.body;
    User.findOneAndUpdate({userName:myName}, {$push: {friends: friend}},(err,user)=>{
        if(err) {
            console.log('add friend server error',err); 
            res.status(400).json({
                errorMessage:'Invalid credentials',
            });
        }
        res.json({data:'friend added'})

    })
})

router.post('/newGroup',(req,res)=>{
    const members=req.body.groupMembers;
    console.log(members,req.body);
    members.forEach(element => {
    User.findOneAndUpdate({userName:element}, {$push: {groups: req.body.groupName}},(err,user)=>{
        if(err) {
                console.log('add friend server error',err); 
                res.status(400).json({
                    errorMessage:'Invalid credentials',
                });
            }
        })
        
    });
    res.json({data:'group added'})
})

module.exports=router;