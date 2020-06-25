// Este componente solo deberia listar consultas pendientes, ver como manejar en el render una vez rechazada!!!
import React from 'react';

import axios from 'axios';
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";

var miAbo = '5ecae752506e8b34f8e26e6c' //abogado

//localStorage.setItem('token',JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlY2M4YWNiMTM1YTM0MGU0YzJlNWU0NyIsImlhdCI6MTU5MDU0OTU2MiwiZXhwIjoxNTkwNjM1OTYyfQ.kcEhHtRwGuH7cxtATmxZRlJI8udPNXi58IXvQvA93Kc'));
//var token = localStorage.getItem('token');

export default class ConsultasRechazadas extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            consultas: []
        }
    }

    componentDidMount() {

        let miParam = {
            params: {
                id: '5ecae752506e8b34f8e26e6c'
            }
        }

        axios({
            method: 'get',
            url: 'http://localhost:5000/api/listab_rechazado',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'x-access-token',
                'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlY2FlNzUyNTA2ZThiMzRmOGUyNmU2YyIsImlhdCI6MTU5MDc5MzE5OCwiZXhwIjoxNTkwODc5NTk4fQ.Y9H1Jc2-ESoll5UA4TzGaP1ZpvKCh4AHhrKDwmK6ClI'
            },
            params: {
                id: '5ecae752506e8b34f8e26e6c'  //VER SI FUNCA; luego arreglar que esto sea un parametro global que sale de localstorage
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

            }
        ]


        return (

            <ReactTable
                columns={columns}
                data={this.state.consultas}
                //filterable
                defaultPageSize={10}
                showPagination={false}
                noDataText={"Cargando Consultas, aguarde ..."}
            >

            </ReactTable>

        )

    }
}