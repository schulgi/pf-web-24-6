import React, { useState } from 'react';

function ConsultaAdd(props){

const { handleConsultaSubmit } = props;

const [consulta, setConsulta] = useState('');


return(
 
  <div>  
    
    <div className="card mt-4 mb-3">
      
      <div className="card-header"><strong>Consulta</strong></div>
       
      <div className="card-body">

        <textarea name="consulta" className="form-control" placeholder="Agregar Consulta"
        
            onChange={event => setConsulta(event.target.value)} value={consulta}></textarea>

      </div>

    </div>      
    
    <div>

      <button className="btn btn-success mr-3" onClick={event => {
        
       handleConsultaSubmit(consulta); 
       
       //setConsulta='' 
       
       }}>Consulta</button>    

      <button className="btn btn-danger mr-3">Cerrar Consulta</button>     

      <button className="btn btn-info mr-3">Archivos Consulta</button>     

    </div>   
  
  </div>     
        
    )   
}

export default ConsultaAdd;
