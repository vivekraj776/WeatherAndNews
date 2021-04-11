/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const { authenticate } = require('./../middleware/authenticate.js');
const {userModel} = require('../models/user');

router.post('/signup',(request,response)=>{
    const { name, password, email } = request.body;
    const newUser = new userModel({
        name,
        password,
        email,
    });
    
    newUser.save().then(()=>{
    return newUser.generateAuthToken();                                                  
    }).then(()=>{
        response.status(200).send(newUser);
    }).catch((e)=>{
        console.log(e);
        response.status(400).send('Error Registering User');
    });
       
});


router.post('/login', (request, response) => {
        const { password, email } = request.body;
        userModel.findByCredentials(email, password).then((user) => {
            if (!user) {                                                                    
                return response.status(400).send('No Such User Found');
            }
            console.log(user);
            user.generateAuthToken().then(() => {                                      
                response.status(200).send('You are successfully logged in!');
            });
        }).catch(() => {
            response.status(400).send('Error Logging in!');
        })
});


router.delete('/logout', authenticate, (request, response) => {
    let user = request.user;                                                                
    let token = request.token;
    user.removeToken(token).then(() => {                                            
        response.status(200).send('You have been logged out succesfully!');
    }).catch(() => {
        response.status(400).send('Error Logging Out!');
    })
});


module.exports = router;