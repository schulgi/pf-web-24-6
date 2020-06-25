import React from 'react';

import axios from 'axios';

var miAbo = '5ecae752506e8b34f8e26e6c' //abogado

//localStorage.setItem('token',JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlY2M4YWNiMTM1YTM0MGU0YzJlNWU0NyIsImlhdCI6MTU5MDU0OTU2MiwiZXhwIjoxNTkwNjM1OTYyfQ.kcEhHtRwGuH7cxtATmxZRlJI8udPNXi58IXvQvA93Kc'));

//var token = localStorage.getItem('token');


export default class ConsultasAbogado extends React.Component { 

    constructor(props) {

        super(props);

        this.state = {
            consultas: []
        }
    }


    componentDidMount() {
        this.getConsultas()
    }

    getConsultas() {

         let miParam = {
           params: {
                id: '5ecc8acb135a340e4c2e5e47'
           }
        }

//console.log(token);

     //   axios.get('http://localhost:5000/api/listab_all', miParam,  { headers : {'x-access-token' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlY2M4YWNiMTM1YTM0MGU0YzJlNWU0NyIsImlhdCI6MTU5MDU0OTU2MiwiZXhwIjoxNTkwNjM1OTYyfQ.kcEhHtRwGuH7cxtATmxZRlJI8udPNXi58IXvQvA93Kc'} } )  
        //Esto appendea a la URL y no sirve para la API que está esperando el ID dentro del Body

//{ headers: {'x-access-token': token}

        axios({
            method: 'get',
            url: 'http://localhost:5000/api/listab_all',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token':  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlY2M4YWNiMTM1YTM0MGU0YzJlNWU0NyIsImlhdCI6MTU5MDY5NTgzNiwiZXhwIjoxNTkwNzgyMjM2fQ.H-1R_U1dP0auLINAR2BtpXoEx15VlFOLOwp91jypPpM'
            },
            params: {
                id: '5ecae752506e8b34f8e26e6c'
           }

        })
  

            .then(res => {
                const consultas_ = res.data.consultaGrupo;
                this.setState({ consultas: consultas_ });
                console.log("arranca response");
                console.log(res.data.consultaGrupo);
                console.log("arranca el this.state");
                console.log(this.state); //quitar esto expone data
            })

            .catch(error => {
                console.log(error)
            })

    }


render () {

    //var {consultas} = this.state;  //esto no afecta al this state de arriba. no asigna nada

    return (
        <div>
        <h1> Lista de Consultas para un abogado</h1>
        </div>
    )


}
}