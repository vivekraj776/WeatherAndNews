/* eslint-disable no-undef */
const express = require('express');
const axios = require('axios');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();

router.get('/headlines', authenticate, async (request, response) => {
    try {
        const search = request.params.search;

        let params = new URLSearchParams();
        params.append('q', search);
        params.append('apiKey', process.env.API_KEY);

        await axios.get(`${process.env.NEWS_URL}/everything`,{
            params: params
        })
            .then(result => {
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
                response.status(200).send(finalResult);
            }).catch(function (error) {
                response.status(400).send('Error while fetching news', error);
            }); 
    } catch (error) {
        response.status(400).send('Error while fetching news', error);
    }
})

module.exports = router;