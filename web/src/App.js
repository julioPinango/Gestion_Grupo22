import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Home from './routes/Home';
import Login from './routes/Login';


function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>

        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
      </div>
    </Router>
  );
}

export default App;

/*
function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const mostrarDatos = () => {
    alert(email);
  }
  return (


    <div className="App">
           <main>
        <form action="/users/login" method="POST" class="login-form">
          <section class="form-login">
            <h4 class="h4-form">Ingresá</h4>
            <div class="div-form">
              <label class="label-form">
                <span class="span-form">E-mail</span>
                <input class="input-form " type="email" 
                onChange={(event) =>{
                  setEmail(event.target.value)
                }
                } />
                
              </label>
            </div>
            <div class="div-form">
              <label class="label-form">
                <span class="span-form" >Contraseña</span>
                <input class="input-form" id="password" type="password" autocomplete="off" name="password" />
              </label>
            </div>

            <button onclick={mostrarDatos} class="button"> Ingresar </button>
            <button class="button-secondary" type="button" onclick="window.history.back();">Cancelar</button>
            <p>¿Olvidaste tu contraseña?</p>
          </section>
        </form>

      </main>
        

</div>  //</body>
  //</div>
  );
}

export default App;
*/