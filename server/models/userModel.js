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
    },
    messages:{
        type:Array,
        default:[]
    }
},
{
    timestamps:true
});

module.exports=mongoose.model('Users',userSchema);