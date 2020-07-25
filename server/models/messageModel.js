var mongoose=require('mongoose');

var messageSchema=mongoose.Schema({
    sender:{
        type:String,
        required:true
    },
    receiver:{
        type:String,
        required:true
    },
    msg:{
        type:String
    }
},
{
    timestamps:true
}
)
module.exports=mongoose.model('Messages',messageSchema);