//Ver como renderizar cada componente segun quien seas

//TODO 
/* Model Especialidad.js
   API que me traiga TODAS las especialidades 
     ver si cargamos una o mas de 1 (consultar con el equipo)

/* Dos formas:
A.- Hacemos dos componentes /páginas y te redirige según quien seas 
B.- Un solo componente o página y te renderiza los campos  --> opcion mas viable, pero revisar!
*/

/*Abogado

-foto dni 
-tomo y el folio
-colegio
-especialidad
*/

/*Cliente
-foto dni */

//Set estado para que habilite los clientes y los abogados al estado correcto para poder contactarse entre sí

/////////////////////////////////////////////////////////////////////////////////////////////////

import React from 'react';
import axios from 'axios';

import './TerminarRegistro.css';

import Uploader from '../components/FileUploads/Uploader';

var Userid = "5ecae460343fbd4dd0acd4f8";  //valor harcodeado, se recibe cuando está el user logueado

const matriculaRegex = RegExp(
    /^[0-9]*$/  
  );

  const formValid = ({ formErrors, ...rest }) => {
    let valid = true;
  
    // validate form errors being empty
    Object.values(formErrors).forEach(val => {
      val.length > 0 && (valid = false);
    });
  
    // validate the form was filled out
    Object.values(rest).forEach(val => {
      val === null && (valid = false);
    });
  
    return valid;
  };
  
  class TerminarRegistro extends React.Component {
    constructor(props) {
      super(props);
    

      this.state = {
        id : Userid,  //Harcoded, deberia cambiar a un data append.
        especialidad: null, //ver como manejamos con los dropdown
        tomo: null,
        folio: null,
        colegio: null,
        cv: null,
       firmaDigital : true,      //ver como manejamos el file upload
        formErrors: {
          especialidad: "",
          tomo: "",
          folio: "",
          colegio: "",
          cv: "",
          firmaDigital : "", 
        }
      };
    }
  
    handleSubmit = e => {
      e.preventDefault();
  
      if (formValid(this.state)) {
        console.log(`
          --SUBMITTING--
          Especialidad: ${this.state.especialidad}
          Tomo: ${this.state.tomo}
          Folio: ${this.state.folio}
          Colegio: ${this.state.colegio}
          CV: ${this.state.cv}
          FirmaDigital ${this.state.firmaDigital}
        `); //muestro en consola el object, OJO password texto plano!
      
        //posteo con axios
        //API Post /finishsignup ???? 
        axios.post('http://localhost:5000/api/terminaregistro',this.state) //OJO con esto, revisar!
            .then( response =>  {
               console.log(response) //OJO esto expone data!!
            })
            .catch(error => {
                console.log(error)
                })

      } else {
        console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
      }
    };
  
    handleChange = e => {
      e.preventDefault();
      const { name, value } = e.target;
      let formErrors = { ...this.state.formErrors }
           ;
  
      switch (name) {
        case "especialidad": //ESTO VUELA, va a ser parte del combo select chequear el error en valores null por default
          formErrors.especialidad =
            value.length < 3 ? "" : "";
          break;

        case "tomo":
          formErrors.tomo =  (matriculaRegex.test(value) &&
            value.length <= 3 )
            ? ""
            : "hasta 3 caracteres numéricos";
          break;

          case "folio":
          formErrors.folio =  (matriculaRegex.test(value) &&
          value.length <= 3 )
            ? ""
            : "hasta 3 caracteres numéricos";
          break;

        case "colegio":
          formErrors.colegio = value.length > 6 //para que validen el colegio, el campo es de texto libre
            ? ""
            : "debe poner un colegio";
          break;

       case "cv":
         formErrors.cv = value.length > 6 //pone CV, campo de texto libre
          ? ""
          : "debe poner un CV";  //revisar estas condiciones para el for
         break;

         case "firmaDigital":
          formErrors.firmaDigital = true //esto no valida nada, no lo necesita (puede no tener firma dig), sacarlo
          ? "" : "";
          break;  
        
          default:
          break;
      }
  
      this.setState({ formErrors, [name]: value }, () => console.log(this.state));
    };
  
    render() {
      const { formErrors } = this.state;
  
      return (
        <div className="wrapper-completion">
          <div className="form-wrapper-completion">
            <h1>Completar Datos del Registro</h1>
            <form onSubmit={this.handleSubmit} noValidate>

            <div className="especialidad">
                <label htmlFor="especialidad">Especialidad</label>
                <input
                 className="" //{formErrors.firstName.length > 0 ? "error" : null}
                  placeholder="Elegir una especialidad" //Agregar combo box que le pegue a la api/especialidades
                  type="text"  //dropdown
                  name="especialidad"
                  noValidate
                  onChange={this.handleChange}
                />
                
              </div>

              <div className="tomo">
                <label htmlFor="tomo">Tomo Matrícula</label>
                <input
                  className= {formErrors.tomo.length > 0 ? "error" : null}
                  placeholder="Tomo Matrícula"
                  type="text"
                  name="tomo"
                  noValidate
                  onChange={this.handleChange}
                />
                    {formErrors.tomo.length > 0 && (
                  <span className="errorMessage">{formErrors.tomo}</span>
                    )}
                 </div>

                 <div className="folio">
                <label htmlFor="folio">Folio Matrícula</label>
                <input
                  className= {formErrors.folio.length > 0 ? "error" : null}
                  placeholder="Folio Matrícula"
                  type="text"
                  name="folio"
                  noValidate
                  onChange={this.handleChange}
                />
                  {formErrors.folio.length > 0 && (
                  <span className="errorMessage">{formErrors.folio}</span>
                    )}
               </div>            
            
              
              <div className="colegio">
                <label htmlFor="colegio">Colegio</label>
                <input
                  className="" //{formErrors.colegio.length > 0 ? "error" : null}
                  placeholder="Colegio"
                  type="text"
                  name="colegio"
                  noValidate
                  onChange={this.handleChange}
                />   
                    {formErrors.colegio.length > 0 && (
                  <span className="errorMessage">{formErrors.colegio}</span>
                    )}
              </div>

              <div className="cv">
                <label htmlFor="cv">CV</label>
                <input
                  className="" //{formErrors.colegio.length > 0 ? "error" : null}
                  placeholder="CV"
                  type="text"
                  name="cv"
                  noValidate
                  onChange={this.handleChange}
                />   
                    {formErrors.cv.length > 0 && (
                  <span className="errorMessage">{formErrors.cv}</span>
                    )}
              </div>          

              <div className="firmaDigital">
                <div> 
                <label htmlFor="cv">Firma Digital</label>
                <input
                  className="" //puede quedar vacia si no le estoy validando el input
                  type="checkbox"
                  name="firmaDigital"
                  defaultChecked= {false} //{this.state.firmaDigital} $("input:checked").val()
                  onChange={this.handleChange}
                /> Firma Digital <br />  
              
               </div>     
              
              </div>     
                        


              <div className="completarDatos">
                <button type="submit">Completar datos</button>
                <small>Algún disclaimer</small>
              </div>
            </form>
          </div>
        </div>
      );
    }
  }
  
  export default TerminarRegistro;