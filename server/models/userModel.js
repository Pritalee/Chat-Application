var mongoose=require('mongoose');

var userSchema=mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    contact:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    userName:{
        type:String
    },
    profilePicture:{
        type:String
    },
    friends:{
        type:Array,
        default:[]
    },
    groups:{
        type:Array,
        default:[]
    }
},
{
    timestamps:true
});


userSchema.index({ userName:'text', email:'text' },
            { weights:{
                userName:5,
                email:1
            } })

module.exports=mongoose.model('Users',userSchema);