const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
mongoose.connect('mongodb://localhost:27017/new',{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true});

const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error;'))
db.once('open',function(){
    console.log("we are connected..")
});

const Details = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobilenumber:{
        type:Number,
        required:true,
        unique:true
    },
    dateofbirth:{
        type:Date,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    pincode:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});

Details.methods.generateauthtoken = async function(){
    try{
        const token = jwt.sign({_id:this._id.toString()},"mynameiskishoraryaandimnottheaterrorist");
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token
    }catch(error){
        res.send("the error part"+error)
        console.log("the error part"+error)
    }
}

Details.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
        this.cpassword = await bcrypt.hash(this.cpassword,10);
    }
    next()
})

const Register = mongoose.model('Register',Details)

module.exports = Register;
