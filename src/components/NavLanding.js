import logo from "../img/icon/icon-futbol.png";
import { Link } from "react-router-dom";
import "../App.css";
import React, { useState, useEffect } from "react";

import { auth } from "../firebase.js";

function Nav() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar si el menú está abierto

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      return user;
    });

    return () => {
      unsubscribe(); // Detiene la observación cuando el componente se desmonta
    };
  }, []);

  return (
    <header className="bg-primary text-white text-center">
      <nav
        className="navbar navbar-light navbar-expand-lg tahoma fs-5"
        id="offcanvasNavbarLabel"
      >
        <div className="container-fluid">
          <div className="d-inline-block">
            <Link id="icono-futbol" to="/">
              <img
                className="d-inline-block"
                src={logo}
                alt="logo de Mi Cancha"
              />
            </Link>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            onClick={() => setMenuOpen(!menuOpen)} // Cambiar el estado cuando se haga clic en el botón
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`offcanvas offcanvas-end ${menuOpen ? "show" : ""}`} // Agregar la clase 'show' cuando el menú está abierto
            tabIndex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className={`paddingClose offcanvas-header ${menuOpen ? "bg-success" : "bg-primary"}`}>
              
              <button
                type="button"
                className="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
                onClick={() => setMenuOpen(false)} // Cambiar el estado cuando se cierre el menú
              ></button>
            </div>
            <div className={`offcanvas-body ${menuOpen ? "bg-success" : "bg-primary"}`}> {/* Cambiar el color de fondo según el estado del menú */}
              <ul className={`fs-6 navbar-nav justify-content-end flex-grow-1 ${menuOpen ? "mt-5" : ""}`}>
              {user ? (
                  <>
                    
                    <li className="nav-item links dropdown">
                    <a href="#pap" className="nav-link text-white">
                      PASO A PASO
                    </a>
                    </li>
                    <li className="nav-item links dropdown">
                    <a href="#faq" className="nav-link text-white">
                      FAQS
                    </a>
                    </li>
                    <li className="nav-item links dropdown">
                      <Link to="/canchas" className="nav-link text-white">
                        CANCHAS
                      </Link>
                    </li>
                    <li>
                    <Link to="/lobby" className="nav-link text-white links">
                        LOBBY
                      </Link>
                    </li>
                    
                    <li className="nav-item  ">
                      <Link
                        to="/registerCancha"
                        className="nav-link text-white links"
                      >
                        REGISTRAR PREDIO
                      </Link>
                    </li>
                    <li className="nav-item links dropdown">
                      <Link to="/profile" className="nav-link text-white">
                      <i class="fa-solid fa-user"></i> {user.displayName || user.email}
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    
                    <li className="nav-item links dropdown">
                    <a href="#pap" className="nav-link text-white">
                      PASO A PASO
                    </a>
                    </li>
                    <li className="nav-item links dropdown">
                    <a href="#faq" className="nav-link text-white">
                      FAQS
                    </a>
                    </li>
                    <li className="nav-item links dropdown">
                      <Link to="/canchas" className="nav-link text-white">
                        CANCHAS
                      </Link>
                    </li>
                    <li className="nav-item links dropdown">
                      <Link to="/lobby" className="nav-link text-white">
                        LOBBY
                      </Link>
                    </li>
                    <li className="nav-item links dropdown">
                      <Link
                        to="/login"
                        className="nav-link text-white "
                      >
                        INICIAR SESIÓN
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Nav;