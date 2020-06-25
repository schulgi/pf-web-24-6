import React from 'react';
import Navbar from '../Navbar/Navbar';

let uid = localStorage.getItem('uid');
let token = localStorage.getItem('token');

localStorage.removeItem('uid');

class Home extends React.Component {


    render (){
        return (
            
            <Navbar></Navbar>
        
         ); 
       }
    }
        
  export default Home;
