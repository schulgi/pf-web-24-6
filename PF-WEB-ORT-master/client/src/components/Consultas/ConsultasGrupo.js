import ReactDOM from 'react-dom';

import axios from 'axios';

import ConsultaAdd from './ConsultaAdd';

import Consulta from './Consulta';

import React, { Component } from 'react';


let token = localStorage.getItem('token');
let usuario = JSON.parse(localStorage.getItem('user'));
let user = usuario._id;
//let user = '5ecaf3e2f81fbc2ad8a13b1a';
let idconsultaGrupo = '5ed1ef6277533a09900bc015';

class ConsultasGrupo extends Component {

    constructor(props){

      super(props);  
       
      this.state = {
    
        consultas: [], consultasPrevias : []  
        
    } 
    
    this.handleConsultaSubmit = this.handleConsultaSubmit.bind(this);

}


componentDidMount() {

    axios({
        method: 'get',
        url: 'http://localhost:5000/api/consultagrupo',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': 'x-access-token',
            'x-access-token': token
        },
        params: {
            id: idconsultaGrupo
        }

    })
        .then(res => {
            const consultasPrevias_ = res.data.textoConsulta;
            this.setState({ consultasPrevias: consultasPrevias_ });
            console.log(this.state.consultasPrevias);
        })

        .catch(error => {
            console.log(error)
        })
       
}


handleConsultaSubmit(data){

 
    const postData = { cons: data, id: idconsultaGrupo, tipo: 'C'  };


    axios.post('http://localhost:5000/api/consulta', postData).then(response => {

        console.log(response.data);

        let consultas = this.state.consultas;

         consultas.push({

            id: consultas.length + 1,

            body: response.data
    })

        this.setState({consultas : consultas});
    
    });
}

renderConsultas(){

    const { consultas } = this.state;

    return consultas.map(consulta => {

        const{ id, body } = consulta;

        return (

           <div className="comentario">
               <h1><Consulta key={id} body={body}/></h1>
           </div>
        );

    })

}


render(){


    //let {consultasPre_} = this.state.consultasPrevias;

    return(

      <div>

          {
          
        <ul>
          

            {this.state.consultasPrevias.map(consultasPre => (
               <li key =  {consultasPre._id}>
                            {consultasPre.texto}
               </li> 
            ))}
        

         </ul>
          
        
          }    

          {this.renderConsultas()}

          <ConsultaAdd handleConsultaSubmit={this.handleConsultaSubmit} />

      </div>  

    );
  }

}

export default ConsultasGrupo;