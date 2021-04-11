/* eslint-disable no-undef */
const {userModel} = require('../models/user');

const authenticate = (request,response,next) =>{
    let token = request.header('x-auth');  
    if(!token){
        response.status(400).send('Please Login to Continue');         
    }
    userModel.findByToken(token).then((user)=>{
        if(!user){
            return Promise.reject();           
        }
        request.user = user;                   
        request.token = token;                
        next();
    }).catch(()=>{
        response.status(401).send('User may not be registered or check x-auth token');         
    });
};

module.exports = {authenticate};