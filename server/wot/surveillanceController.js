"use strict";

const axios = require("axios");
const fs = require('fs');
const base64Img = require('base64-img');
const https = require('https');

const camera = require("./camera");
const motion = require("./motion");

let Router = require("/home/pi/SurveillanceCamera/api/app/routes");

/**
 * PIR sensor triggered, then camera takes picture, then send to clients and updates properties.
 */
motion.sensor.on('movement', function () {
    camera.stillCamera.takeImage().then( image => {
        var date = new Date(Date.now());
        var fileName = "/home/pi/SurveillanceCamera/images/"+date.toISOString()+".jpg";
        fs.writeFileSync(fileName, image);
       
        base64Img.base64(fileName, function(err, data) {
            Router.sendToWebsocketClients([{image: data, filename: date.toISOString()}]);
        })
        
    });
});

/**
 * For future cloud integration pattern
 * @param {*} image 
 */
function postToApi(image) {
    return new Promise( (resolve, reject) => {
        axios({
            httpsAgent: new https.Agent({rejectUnauthorized: false}),
            method: "post",
            url: "https://www.projectsbyjohan.com/surveillance/api",
            data: {
                image: image
            }
        }).then((res) => {
            resolve(res);
        }).catch( (err) => {
            reject(err);
        })
    })
}

