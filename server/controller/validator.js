const {check,validationResult}=require('express-validator');

exports.signupValidator=[
    check('email').isEmail().normalizeEmail().withMessage('Invalid Email'),
    check('password').isLength({min:6}).withMessage('Password must be six character long'),
];


exports.resultValidator= (req,res,next)=>{
    const result=validationResult(req);
    const hasErrors=!result.isEmpty();
    if(hasErrors){
        const firstError=result.array()[0].msg;
        return res.status(400).json({
            errorMessage:firstError,
        });
        
        //console.log('has errors:',hasErrors);
        //console.log('Result:',result);
    }
    next();
};