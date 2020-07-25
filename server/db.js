var mongoose=require('mongoose')

const connectDb=async()=>{
    try{
mongoose.connect('<add url obtained from mongodb>',{useNewUrlParser: true,useUnifiedTopology: true });
console.log('connected to db')

    }catch(e){
        console.log('DB connection error',e);
    }
}

module.exports= connectDb;