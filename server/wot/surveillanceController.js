"use strict";

const axios = require("axios");
var ffmpeg = require("fluent-ffmpeg");
const fs = require('fs');
const base64Img = require('base64-img');
const https = require('https');

const camera = require("./camera");
const motion = require("./motion");

let Router = require("/home/pi/SurveillanceCamera/api/app/routes");

let inFilename = "/home/pi/SurveillanceCamera/video-stream.h264";
let outFilename = "/home/pi/SurveillanceCamera/video.mp4";

motion.sensor.on('movement', function () {
    console.log("Movement");
    camera.stillCamera.takeImage().then( image => {
        var date = new Date(Date.now());
        var fileName = "/home/pi/SurveillanceCamera/images/"+date.toISOString()+".jpg";
        fs.writeFileSync(fileName, image);
       
        base64Img.base64(fileName, function(err, data) {
            Router.sendToWebsocketClients([{image: data, filename: date.toISOString()}]);
        })
        
    });
});

function base64_encode(image) {
    return new Promise( (resolve, reject) => {
        let bitmap = fs.readFileSync(image);
        let img = new Buffer(bitmap).toString('base64');
        resolve (img);
    }).catch( (err) => {
        reject(err);
    })
    
}

function postToApi(image) {
    return new Promise( (resolve, reject) => {
        axios({
            httpsAgent: new https.Agent({rejectUnauthorized: false}),
            method: "post",
            url: "https://13.53.201.101/surveillance/api",
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

/*
var obj = "";
camera.videoStream.on("data", data => obj = obj+JSON.stringify(data));
//camera.videoStream.on("data", data => console.log(JSON.stringify(data)));
camera.videoStream.on("end", data => console.log("Video stream has ended"));
camera.streamCamera.startCapture().then(() => {
 
    setTimeout( () => {
        camera.streamCamera.stopCapture()
        console.log(obj);
        ffmpeg(inFilename)
            .outputOptions("-c:v", "copy") // this will copy the data instead or reencode it
            .save(outFilename);
    }, 5000)
    
});
*/



