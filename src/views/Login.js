import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, signInWithEmailAndPassword } from "../firebase.js";
import Footer from "../components/footer.js";
import NavAll from "../components/Nav";
import "./App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Nuevo estado

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("Usuario ya inició sesión. UID:", user.uid);
        window.location.href = "/profile"; // Redirige a la ruta principal si ya está logueado
      }
    });

    return () => {
      unsubscribe(); // Detiene la observación cuando el componente se desmonta
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      console.log(email, password);
      // Lógica de inicio de sesión utilizando Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      console.log("Inicio de sesión exitoso. UID:", user.uid);
      window.location.href = "/";
    } catch (error) {
      // Manejo de errores
      setErrorMessage("La contraseña o el correo no son válidos");
    }
  };

  return (
    <main>
      <NavAll></NavAll>
      <div className="imagenForm">
        <div className="container  fondoForm">
          <h2 className="text-center text-white">Iniciar Sesión</h2>
          <form className="mx-auto w-75" id="loginForm" onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label  text-white">
                Correo Electrónico
              </label>
              <input
                type="text"
                className="form-control email-input"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label  text-white">
                Contraseña
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className=" password-input form-control"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className=" btn-outline-secondary showPassword"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i
                    className={`fa ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
                  ></i>
                </button>
              </div>
            </div>
            <div
            id="error-message"
            style={{ color: "green" }}
            className="text-center mb-3 text-danger fw-bold"
          >
            {errorMessage}
          </div>
            <div className="olvidaste text-center mb-3 text-white fw-bold"><a href="#">¿Olvidaste tu contraseña?</a></div>
            <div className="text-center">
              <button type="submit" className="btn">
                Iniciar Sesión
              </button>
            </div>
            <div className="text-center mt-3">
              <Link to="/register" className="botonRegister">
                Registrate
              </Link>
            </div>
          </form>
          
        </div>
      </div>
      <Footer></Footer>
    </main>
  );
}

export default Login;
