import React from 'react';
import axios from 'axios';

import './Sign.css';

const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/
);

const formValid = ({formErrors, ...rest}) => {
  let valid = true;

    //validate form errors being empty
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false )
  });
   
  //validate form was filled out
   Object.values(rest).forEach(val => {
     val === null && (valid = false)
   });

   return valid;
  };


class SigninFailed extends React.Component {

  constructor(props) {
    super(props);
    //this.state = {value: ''};

    this.state = {
      email: null,
      password: null,
      formErrors: {
        email: "",
        password: ""   
        } 
    };
  } //cierro props


  handleSubmit = e => {
    e.preventDefault();

    if (formValid(this.state)) {
      console.log(`
        --Submitting--
        email:  ${this.state.email}
        password: ${this.state.password}  
        `) //muestro en consola el object, OJO password texto plano!

      //posteo con axios
      axios.post('http://localhost:5000/api/signin', this.state) //OJO con esto, revisar!
        .then(response => {
          
          if(response.data.success == true){

          localStorage.setItem('token', response.data.token);
          var t = localStorage.getItem('token');

          axios.get('http://localhost:5000/api/verify', { headers: { 'x-access-token': t } })
            .then(response => {
              localStorage.setItem('user', response.data);
              return this.props.history.push("/menu");
            })
            .catch(err => {
              console.log(err)
           })
          
          }else{
            //INVALID FORM 
            return this.props.history.push("/signinfailed");
            //Deberia renderizar sobre el mismo Componente
          }

        })
        .catch(err => {
           console.log(err)
        })

    } else {
      //INVALID FORM 
      return this.props.history.push("/signinfailed");
      //Deberia renderizar sobre el mismo Componente 
    }
  }; 


  handleChange = e => {
    e.preventDefault();
    const { name,value } = e.target;    //destructuring  --cambiado a email y pass!!!
    let formErrors = this.state.formErrors;

    //console.log("name", name);
    //console.log("value", value);

    switch (name) {  

      case "email": 
      formErrors.email = 
        emailRegex.test(value) && value.length > 0    
        ? ""                              //evaluation for true
        : "dirección de email inválida"  //eval for false
      break;

      case "password": 
      formErrors.password = 
        value.length < 6 //queda redundante evaluar value.length > 0                 
        ? "mínimo 6 caracteres"    
        : ""
      break;
    
      default:
      break;
    
    }    
    this.setState({formErrors, [name]: value}, () => console.log(this.state));
  }


    
render() {
  const {formErrors} = this.state;

return (

  <div className="Sign-in">
  <div className ="wrapper">

    <div className= "form-wrapper">
      <h1>Ingresar</h1>
      <form onSubmit= {this.handleSubmit} noValidate> 
  
      <div className="email">
          <label htmlFor="email"> Email </label>
          <input 
          className={formErrors.email.length > 0 ? "error": null}     //what string should be
          placeholder="Email"  
          type="email" 
          name="email" 
            noValidate
            onChange = {this.handleChange}
          />
          {formErrors.email.length > 0 && (
           <span className ="errorMessage">{formErrors.email}</span>      
          )}
        </div>
       
        <div className="password">
          <label htmlFor="password"> Contraseña </label>
          <input 
          className={formErrors.password.length > 0 ? "error": null}
          placeholder="Contraseña"  
          type="password" 
          name="password" 
            noValidate
            onChange = {this.handleChange}
          />
          {formErrors.password.length > 0 && (
           <span className ="errorMessage">{formErrors.password}</span>      
          )}

        </div>

        <div className="errorLogin">Mail o contraseña incorrectos</div>
     
        <div className = "logInAccount">
          <button type="Submit"> Ingresar </button>
        </div>

      </form>
    </div>
  </div>
</div>




); //fin return
 
} //fin render

} //fin clase


  export default SigninFailed;
  
  //acá va la funcion fetch