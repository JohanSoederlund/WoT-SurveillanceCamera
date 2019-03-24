const { StreamCamera, Codec, StillCamera } = require("pi-camera-connect");
const fs = require('fs');
 
const streamCamera = new StreamCamera({
    codec: Codec.H264
});
 
const writeStream = fs.createWriteStream("video-stream.h264");
 
const videoStream = streamCamera.createStream();

const stillCamera = new StillCamera();

videoStream.pipe(writeStream);

/*
videoStream.on("data", data => console.log(data));
videoStream.on("end", data => console.log("Video stream has ended"));
streamCamera.startCapture().then(() => {
    setTimeout(() => streamCamera.stopCapture(), 5000);
});
*/

module.exports = {
    streamCamera,
    videoStream,
    stillCamera
}
