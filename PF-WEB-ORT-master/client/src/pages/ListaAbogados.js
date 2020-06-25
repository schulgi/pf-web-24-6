import React from 'react';
import axios from 'axios';

 export default class ListaAbogados extends React.Component {

    constructor(props){
    
        super(props);

    this.state = {
        abogados : []
}
}

componentDidMount(){
    this.getItems()
}

getItems() {

    axios.get('http://localhost:5000/api/list/abogados') 
 
  .then( res =>  {
    const abogados_ = res.data;
    this.setState({abogados: abogados_});
    console.log(this.state);
 })

 .catch(error => {
     console.log(error)
     })

}


render () {

    var {abogados} = this.state;

    return (
        <div>
            <h1> Lista de abogados</h1>
            <ul>
                {abogados.map(abogado => (
                   <li key =  {abogado.id}>
                       Nombre: {abogado.nombre}
                       Apellido: {abogado.apellido}
                       Especialidad: {abogado.especialidad}
                       Ubicacion: {abogado.partido} , {abogado.zona}

                   </li> 
                ))};
                }

            </ul>

        </div>


    ) //fin return render
} //fin render
} //fin clase
