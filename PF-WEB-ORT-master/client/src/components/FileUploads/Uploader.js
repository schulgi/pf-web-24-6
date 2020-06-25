import React, { Component } from 'react';
import axios from 'axios';

var miUser = '5ec1e0e0369e8b1bf8c5c9bd'  // '5ebce02741c1b5fa54114ec2'
//Ver como defino miUser en una var global post login o cuando lo necesite

class Uploader extends Component {

  state = {
   imageUrl: null
  };
  
  
  handleUploadFile = (event) => {
    const data = new FormData()
    data.append('file', event.target.files[0])
    data.append('id', miUser) //esto agrega el id al post en formato JSON y persiste como ObjectID
  
    axios.post('http://localhost:5000/api/upload', data)
    .then((response) => {   //ver mas adelante pagina de error, para cuando hay error al llamar API del archivo
      this.setState({
        imageUrl: response.data.fileUrl
      })
    })
    console.log(miUser);
  }
    
  render() {
    return(
      <div>
        <img width='320' src={this.state.imageUrl} />
        <div>
          <input type="file" onChange={this.handleUploadFile} />
        </div>  
      </div>
    )
  }
}

export default Uploader;