const express=require('express');
const router=express.Router();
const Messages=require('../models/messageModel');
const {signupValidator,resultValidator}=require('../controller/validator')
const {signupController,loginController}=require('../controller/authController');


router.post('/signup',signupValidator,resultValidator,signupController);
router.post('/login',signupValidator,resultValidator,loginController);

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

module.exports=router;