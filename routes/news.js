/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const axios = require('axios');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();
const redis = require('redis');
const {promisify} = require('util');

const client = redis.createClient({
    host: process.env.HOST,
    port: process.env.PORT
})

const READ_SYS = promisify(client.get).bind(client);
const WRITE_SYS = promisify(client.set).bind(client);

router.get('/headlines', authenticate, async (request, response) => {
    try {
        const search = request.params.search;

        let params = new URLSearchParams();
        params.append('q', search);
        params.append('apiKey', process.env.API_KEY);
        const reply = await READ_SYS('news');
        if(reply){
            console.log(reply);
            return res.status(200).send(JSON.parse(reply));
        }

        await axios.get(`${process.env.NEWS_URL}/everything`,{
            params: params
        })
            .then( async result => {
                let newResult = result.data;
                let data = [];
                if(newResult && newResult.totalResults > 10){
                    for (let i = 0; i < 10; i++) {
                        let newData = {
                            headLine: newResult.articles[i].content,
                            url: newResult.articles[i].url
                        }
                        data.push(newData);
                    }   
                }
                let finalResult = {
                    count: 10,
                    data
                }
                const saveResult = await WRITE_SYS('news', JSON.stringify(finalResult), 'EX', 5);
                return response.status(200).send(finalResult);
            }).catch(function (error) {
                return response.status(400).send('Error while fetching news', error);
            }); 
    } catch (error) {
        return response.status(400).send('Error while fetching news', error);
    }
})

module.exports = router;