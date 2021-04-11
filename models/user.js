/* eslint-disable no-undef */
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//User model to add the new user into the schema
var userSchema = new mongoose.Schema({
    name:{ 
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
});

userSchema.methods.generateAuthToken = function (){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();
    user.tokens.push({access,token});
    return user.save().then(()=>{
        return token;
    });
};


userSchema.methods.removeToken = function(token) {
    var user = this;
    if(!token){
        return Promise.reject(`Token is ${token}`);
    }
    return user.update({
        $pull:{tokens:{token}}
    });
}


userSchema.statics.findByCredentials = function(email,password){
    var userModel = this;
   return userModel.findOne({email:email}).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        console.log(user.password);
        return new Promise((resolve,reject)=>{
            bcrypt.compare(password,user.password,(error,result)=>{
                if(result){
                    resolve(user);
                }else{
                    console.log(error);
                    reject('not found');
                }
            });
        });
    });
};


userSchema.statics.findByToken = function(token){
    var userModel = this;
    var decoded;
    try{
        decoded = jwt.verify(token,'abc123');
    }
    catch(e){
        return Promise.reject("Error Occured");
    }
    return userModel.findOne({
        _id:decoded._id,
        'tokens.token': token,
        'tokens.access':'auth'
    });
};

userSchema.pre('save',function(next){
    var user = this;
    if(user.isModified('password')){
        let password = user.password;
        bcrypt.genSalt(10,(error,salt)=>{
            bcrypt.hash(password,salt,(error,hash)=>{
                user.password = hash; 
                next();
            })
        })
    }else{
        next();
    }
});


var userModel = mongoose.model('user',userSchema);

module.exports = {userModel};