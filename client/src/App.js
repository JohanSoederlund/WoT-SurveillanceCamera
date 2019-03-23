import React, { Component } from 'react';
import './App.css';
import Gallery from './ImageGallery';

import socket from './Websocket.js';
import WotClient from './WotClient';

const body = {password: "qwe123"}
const getLoginData = async (url, method) => {
  try {
    const response = await fetch(url, {
      method: method,
      body:    JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
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

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {images: []};
  }

  async componentDidMount() {
    let entryResponse = await getEntryPointData("https://83.250.202.129/");
    let data = await getLoginData(entryResponse.links.login, "post");
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

    this.setState(this.state);
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

