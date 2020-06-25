import React from 'react';
import Signin from './components/IndexPage/Register/Signin';
import SigninFailed from './components/IndexPage/Register/SigninFailed';
import Signup from './components/IndexPage/Register/Signup';
import Home from './components/IndexPage/Home/Home';
import ConsultasGrupo from './components/Consultas/ConsultasGrupo';
import ListaAbogados from './pages/ListaAbogados';
import TerminarRegistro from './pages/TerminarRegistro';
import PersistentDrawerLeft from './components/MainPage/PersistentDrawerLeft';


//import UserProfile from './components/IndexPage/UserProfile.js';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

class App extends React.Component {

render (){
    return (
      
      <Router>

        <Switch>

        <Route exact path="/" component={Home} />

        <Route exact path="/main" component={PersistentDrawerLeft} />
      
        <Route exact path="/signup" component={Signup} />
      
        <Route exact path="/signin" component={Signin} />

        <Route exact path="/signinfailed" component={SigninFailed} />

        <Route exact path="/consulta" component={ConsultasGrupo} />

        <Route exact path="/listabogados" component={ListaAbogados} />

        <Route exact path="/menu" component={PersistentDrawerLeft} />

        <Route exact path="/terminaregistro" component={TerminarRegistro} />

        </Switch>

      </Router>
           ); 

         }
}


export default App;