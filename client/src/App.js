import React, { Component } from 'react';
import './App.css';
import Gallery from './ImageGallery';
import WotClient from './WotClient';
import socket from './Websocket.js';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {images: []};
  }

  /**
   * API calls (entry-point, login, properties)
   */
  async componentDidMount() {
    //Get links
    let entryResponse = await WotClient.getEntryPointData("https://83.250.202.129/");
    //Login, get jwt
    let data = await WotClient.getLoginData(entryResponse.links.login, "post", { 'Content-Type': 'application/json' });
    
    // websocket pub/sub camera
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

    //Get last image
    let imgs = this.state.images;
    let imgResponse = await WotClient.getProperties(entryResponse.links.properties, { 'Content-Type': 'application/json', 'Authorization': data.accessToken });
    imgs.push({original: imgResponse.properties[0].values.pic, thumbnail: imgResponse.properties[0].values.pic, originalTitle: imgResponse.properties[0].values.timestamp, description: imgResponse.properties[0].values.timestamp});
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

