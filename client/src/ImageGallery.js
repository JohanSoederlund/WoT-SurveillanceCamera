import ImageGallery from 'react-image-gallery';
import React, { Component } from 'react';
import './ImageGallery.css';


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