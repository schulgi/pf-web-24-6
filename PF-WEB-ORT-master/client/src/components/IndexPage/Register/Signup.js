//Sign-in desde el Front

import React from 'react';
import axios from 'axios';

import './Sign.css';

const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
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
  
  class Signup extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        firstName: null,
        lastName: null,
        email: null,
        password: null,
        formErrors: {
          firstName: "",
          lastName: "",
          email: "",
          password: ""
        }
      };
    }
  
    handleSubmit = e => {
      e.preventDefault();
  
      if (formValid(this.state)) {
        console.log(`
          --SUBMITTING--
          First Name: ${this.state.firstName}
          Last Name: ${this.state.lastName}
          Email: ${this.state.email}
          Password: ${this.state.password}
        `); //muestro en consola el object, OJO password texto plano!
      
        //posteo con axios
        axios.post('http://localhost:5000/api/signup',this.state) //OJO con esto, revisar!
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
      //agregado para el post, chequear
      ;
  
      switch (name) {
        case "firstName":
          formErrors.firstName =
            value.length < 3 ? "mínimo 3 caracteres" : "";
          break;
        case "lastName":
          formErrors.lastName =
            value.length < 3 ? "mínimo 3 caracteres" : "";
          break;
        case "email":
          formErrors.email = emailRegex.test(value)
            ? ""
            : "dirección de email inválida";
          break;
        case "password":
          formErrors.password =
            value.length < 6 ? "mínimo 6 caracteres" : "";
          break;
        default:
          break;
      }
  
      this.setState({ formErrors, [name]: value }, () => console.log(this.state));
    };
  
    render() {
      const { formErrors } = this.state;
  
      return (
        <div className="wrapper">
          <div className="form-wrapper">
            <h1>Crear Cuenta</h1>
            <form onSubmit={this.handleSubmit} noValidate>
              <div className="firstName">
                <label htmlFor="firstName">Nombre</label>
                <input
                  className={formErrors.firstName.length > 0 ? "error" : null}
                  placeholder="Nombre"
                  type="text"
                  name="firstName"
                  noValidate
                  onChange={this.handleChange}
                />
                {formErrors.firstName.length > 0 && (
                  <span className="errorMessage">{formErrors.firstName}</span>
                )}
              </div>
              <div className="lastName">
                <label htmlFor="lastName">Apellido</label>
                <input
                  className={formErrors.lastName.length > 0 ? "error" : null}
                  placeholder="Apellido"
                  type="text"
                  name="lastName"
                  noValidate
                  onChange={this.handleChange}
                />
                {formErrors.lastName.length > 0 && (
                  <span className="errorMessage">{formErrors.lastName}</span>
                )}
              </div>
              <div className="email">
                <label htmlFor="email">Email</label>
                <input
                  className={formErrors.email.length > 0 ? "error" : null}
                  placeholder="Email"
                  type="email"
                  name="email"
                  noValidate
                  onChange={this.handleChange}
                />
                {formErrors.email.length > 0 && (
                  <span className="errorMessage">{formErrors.email}</span>
                )}
              </div>
              <div className="password">
                <label htmlFor="password">Contraseña</label>
                <input
                  className={formErrors.password.length > 0 ? "error" : null}
                  placeholder="Contraseña"
                  type="password"
                  name="password"
                  noValidate
                  onChange={this.handleChange}
                />
                {formErrors.password.length > 0 && (
                  <span className="errorMessage">{formErrors.password}</span>
                )}
              </div>
              <div className="createAccount">
                <button type="submit">Crear Cuenta</button>
                <small>¿Ya estás registrado?</small>
              </div>
            </form>
          </div>
        </div>
      );
    }
  }
  
  export default Signup;