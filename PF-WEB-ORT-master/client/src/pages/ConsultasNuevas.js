import React from 'react';

import axios from 'axios';
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";

//let abo = JSON.parse(localStorage.getItem('uid'));
let token = localStorage.getItem('token');
let usuario = JSON.parse(localStorage.getItem('user'));

let idUsuario = usuario._id;

export default class ConsultasNuevas extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            consultas: []
        }
    }

    componentDidMount() {

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
                const consultas_ = res.data.consultaGrupo;
                this.setState({ consultas: consultas_ });
            })

            .catch(error => {
                console.log(error)
            })

    }

    rechazarConsulta(id_) {
        console.log("id", id_);

        axios({
            method: 'post',
            url: 'http://localhost:5000/api/rechazoservicio', //si agregamos verifyToken hay que agregar los headers
            data: {
                idconsulta: id_ 
            }

        })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
    }


    aceptarConsulta(id_) {
        console.log("id", id_);

        axios({
            method: 'post',
            url: 'http://localhost:5000/api/aceptoservicio', //si agregamos verifyToken hay que agregar los headers
            data: {
                idconsulta: id_ 
            }

        })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
    }




    render() {

        

        const columns = [

            {
                Header: "Nombre Cliente",
                accessor: "id_cli.nombre"

            },
            {
                Header: "Apellido Cliente",
                accessor: "id_cli.apellido"

            },

            {
                Header: "Motivo Consulta",
                accessor: "motivo",

            },
            {
                Header: "Fecha Consulta",
                accessor: "created",
                Cell: props => new Date(props.value).toISOString().slice(0, 10)
            },
            {
                Header: "Estado",
                accessor: "estado",

            },
            {
                Header: "Acciones",
                Cell: props => {
                    return (
                        <button style={{ backgroundColor: '#ccfcc2' }}
                            onClick={() => {
                                this.aceptarConsulta(props.original._id)
                            }}
                        > Aprobar </button>
                    )

                },
                sortable: false,
                filterable: false,
                width: 100,
                maxWidth: 100,
                minWidth: 100
            },
            {
                Header: " ",
                Cell: props => {
                    return (
                        <button style={{ backgroundColor: '#ffc0b8' }}
                            onClick={() => {
                                this.rechazarConsulta(props.original._id)
                            }}
                        > Rechazar </button>
                    )

                },
                sortable: false,
                filterable: false,
                width: 100,
                maxWidth: 100,
                minWidth: 100
            }
        ]


        return (
            
            <div>
                    {usuario.nombre} {usuario.apellido}: estas son sus consultas para aprobar o rechazar
                    <br></br>

            <ReactTable
                columns={columns}
                data={this.state.consultas}
                //filterable
                defaultPageSize={10}
                showPagination={false}
                noDataText={"Cargando Consultas, aguarde ..."}
            >

            </ReactTable>
            </div>

        )

    }
}