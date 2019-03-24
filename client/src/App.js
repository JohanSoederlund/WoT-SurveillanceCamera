import React, { Component } from 'react';
import './App.css';
import Gallery from './ImageGallery';

import socket from './Websocket.js';
import WotClient from './WotClient';

const body = {password: "qwe123"}
const getData = async (url, method, headers) => {
  try {
    const response = await fetch(url, {
      method: method,
      body:    JSON.stringify(body),
      headers: headers,
    })
    const json = await response.json();
    return json;
  } catch (err) {
    console.log(err);
  }
};

const getEntryPointData = async (url) => {
  try {
    const response = await fetch(url)
    const json = await response.json();
    return json;
  } catch (err) {
    console.log(err);
  }
};

const getProperties = async (url, headers) => {
  try {
    const response = await fetch(url, { headers: headers }) 
    const json = await response.json();
    return json;
  } catch (err) {
    console.log(err);
  }
};

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {images: []};
  }

  async componentDidMount() {
    let entryResponse = await getEntryPointData("https://83.250.202.129/");
    let data = await getData(entryResponse.links.login, "post", { 'Content-Type': 'application/json' });
    socket.emit("camera", data.accessToken);
    
    socket.on('camera', (data) => {
      let images = this.state.images;
      data.forEach( (image) => {
        images.push({original: image.image, thumbnail: image.image, originalTitle: image.filename, description: image.filename});
      })
      this.setState({images: images}, function(){
        this.setState(this.state);
      }.bind(this) );
    })

    let imgs = this.state.images;
    let imgResponse = await getProperties(entryResponse.links.properties, { 'Content-Type': 'application/json', 'Authorization': data.accessToken });
    console.log(imgResponse);
    imgs.push({original: imgResponse.properties[0].values.pic, thumbnail: imgResponse.properties[0].values.pic, originalTitle: imgResponse.properties[0].values.timestamp, description: imgResponse.properties[0].values.timestamp});
    //this.setState(this.state);
    this.setState({images: imgs});
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">

        <Gallery className="gallery" images={this.state.images}/>
        </header>
      </div>
    );
  }
}

export default App;

