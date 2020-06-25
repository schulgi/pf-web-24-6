import React from 'react';
import axios from 'axios';

let token = localStorage.getItem('token');
let usuario = JSON.parse(localStorage.getItem('user'));

let idUsuario = usuario._id;

export default class Bienvenida extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            countConsultasNuevas: "",
            countConsultasAceptadas: ""
        }
    }


    componentDidMount() {

        //Consultas Nuevas
        axios({
            method: 'get',
            url: 'http://localhost:5000/api/listab_pending',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': token
            },
            params: {
                id: idUsuario
            }

        })
            .then(res => {
                const countConsultasNuevas_ = res.data.consultaGrupo.length;
                this.setState({ countConsultasNuevas: countConsultasNuevas_ });
            })

            .catch(error => {
                console.log(error)
            })


        //Consultas Aceptadas
        axios({
            method: 'get',
            url: 'http://localhost:5000/api/listab_aceptado',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': token
            },
            params: {
                id: idUsuario
            }

        })
            .then(res => {
                const countConsultasAceptadas_ = res.data.consultaGrupo.length;
                this.setState({ countConsultasAceptadas: countConsultasAceptadas_ });
            })

            .catch(error => {
                console.log(error)
            })
    }

    render() {
        return (

            <div>
                <div>Bienvenido, {idUsuario}. </div>

                <div>Bienvenido, {usuario.nombre} {usuario.apellido}. </div>
                <div>Tiene {this.state.countConsultasNuevas} consultas nuevas, para aprobar o rechazar. </div>
                <div>Tiene {this.state.countConsultasAceptadas} consultas aceptadas, disponibles para iniciar asesoría al cliente. </div>
            </div>
        );
    }
}