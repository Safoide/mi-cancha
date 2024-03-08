import React, { useState } from "react";
import {
  db,
  auth,
  createUserWithEmailAndPassword,
  doc,
  setDoc,
} from "../firebase.js";
import { Link } from "react-router-dom";
import Footer from "../components/footer.js";
import NavAll from "../components/Nav";
import "./App.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Nuevo estado

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      const uid = user.uid;

      const docRef = await setDoc(doc(db, "usuarios", uid), {
        correo: email,
        rol: "usuario",
      });

      setErrorMessage("Datos guardados correctamente");
      setTimeout(() => {
        window.location.href = "./profile";
      }, 1000);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setErrorMessage("Los datos no fueron guardados correctamente");
    }
  };

  return (
    <main>
      <NavAll />
      <div className="imagenForm">
        <div className="container  fondoForm">
          <h2 className="text-center text-white">Registro de Usuario</h2>
          <form
            className="mx-auto w-75"
            id="registerForm"
            onSubmit={handleRegister}
          >
            <div className="mb-3">
              <label
                htmlFor="emailRegistro"
                className="form-label  text-white mt-3"
              >
                Correo Electrónico*
              </label>
              <input
                type="email"
                className="form-control email-input"
                id="emailRegistro"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="passwordRegistro"
                className="form-label  text-white"
              >
                Contraseña*
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control password-input"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className=" btn-outline-secondary showPassword"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`fa ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
                  ></i>
                </button>
              </div>
            </div>
            <div className="text-center">
              <button type="submit" className="btn">
                Registrar
              </button>
            </div>
            <div className="text-center mt-3 mb-3">
              <Link to="/login" className="botonRegister">
                Iniciar sesion
              </Link>
            </div>
          </form>
          <div
            id="error-message"
            style={{ color: "green" }}
            className="text-center"
          >
            {errorMessage}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default Register;
