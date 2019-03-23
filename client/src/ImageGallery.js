import ImageGallery from 'react-image-gallery';
import React, { Component } from 'react';
import './ImageGallery.css';



const images = [
    {
      original: 'http://lorempixel.com/1000/600/nature/1/',
      thumbnail: 'http://lorempixel.com/250/150/nature/1/',
    },
    {
      original: 'http://lorempixel.com/1000/600/nature/2/',
      thumbnail: 'http://lorempixel.com/250/150/nature/2/'
    },
    {
      original: 'http://lorempixel.com/1000/600/nature/3/',
      thumbnail: 'http://lorempixel.com/250/150/nature/3/'
    }
  ]

class Gallery extends React.Component {

  constructor(props) {
    super(props);
    this.state = { images: props.images}
  }
    
    componentDidMount() {
       this.setState(this.state);
    }

    componentWillReceiveProps(props) {
      this.setState(  {images: this.props.images})
    }


  render() {
    
 
    return (
      <ImageGallery items={this.state.images} />
    );
  }
 
}

export default Gallery;