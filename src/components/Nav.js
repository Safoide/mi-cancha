import logo from "../img/icon/icon-futbol.png";
import { Link } from "react-router-dom";
import "../App.css";
import React, { useState, useEffect } from "react";

import { auth } from "../firebase.js";

function NavAll() {
  const [user, setUser] = useState(null);

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
    <header className="navAll text-white text-center">
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
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header bg-success">
              
              <button
                type="button"
                className="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body bg-success">
              <ul className="fs-6 navbar-nav justify-content-end flex-grow-1">
                {user ? (
                  <>
                    <li className="nav-item links dropdown ">
                      <Link to="/canchas" className="nav-link text-white">
                        CANCHAS
                      </Link>
                    </li>
                    <li className="nav-item links dropdown ">
                      <Link to="/lobby" className="nav-link text-white">
                        LOBBY
                      </Link>
                    </li>
                    <li className="nav-item dropdown ">
                      <Link
                        to="/registerCancha"
                        className="nav-link text-white links"
                      >
                        REGISTRAR PREDIO
                      </Link>
                    </li>
                    <li className="nav-item links dropdown ">
                      <Link to="/profile" className="nav-link text-white">
                      <i class="fa-solid fa-user"></i> {user.displayName || user.email}
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
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

export default NavAll;
