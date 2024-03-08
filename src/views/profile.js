import React, { useState, useEffect } from "react";
import {
  auth,
  updateProfile,
  signOut,
  db,
  collection,
  where,
  getDocs,
  query,
  deleteDoc,
  doc,
} from "../firebase.js";
import Nav from "../components/Nav.js";
import Footer from "../components/footer.js";
import { Link } from "react-router-dom";
import obtenerRolDeUsuario from "../hooks/obtenerRolDeUsuario";

function Profile() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const obtenerReservasDelUsuario = async () => {
      try {
        const reservasQuery = query(
          collection(db, "reservas"),
          where("userID", "==", user.uid)
        );
        const reservasSnapshot = await getDocs(reservasQuery);

        const reservasData = reservasSnapshot.docs.map((doc) => doc.data());
        setReservas(reservasData);
      } catch (error) {
        console.error("Error al obtener las reservas del usuario:", error);
      }
    };
    if (user) {
      obtenerReservasDelUsuario();
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((newUser) => {
      if (newUser) {
        setUser(newUser);
        setDisplayName(newUser.displayName ?? "");
        setEmail(newUser.email ?? "");

        obtenerRolDeUsuario(newUser.uid).then((rol) => {
          setUserRole(rol);
          console.log(rol);
        });
      } else {
        window.location.href = "/login";
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleUpdateProfile = async () => {
    try {
      if (
        newDisplayName !== (displayName ?? "") ||
        newEmail !== (email ?? "")
      ) {
        await updateProfile(auth.currentUser, {
          displayName: newDisplayName,
          email: newEmail,
        });
        setDisplayName(newDisplayName);
        setEmail(newEmail);
        setNewDisplayName("");
        setNewEmail("");
        setError(null);
      } else {
        setError("No se realizaron cambios en el perfil.");
      }
    } catch (error) {
      setError("Error al actualizar el perfil. Por favor, inténtalo de nuevo.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setDisplayName("");
      setEmail("");
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleDeleteReserva = async (reservaId) => {
    try {
      await deleteDoc(doc(db, "reservas", reservaId));

      const updatedReservas = reservas.filter(
        (reserva) => reserva.id !== reservaId
      );
      setReservas(updatedReservas);
      window.location.reload();
    } catch (error) {
      console.error("Error al eliminar la reserva:", error);
    }
  };

  const formatDate = (dateTimeStr) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const formattedDate = new Date(dateTimeStr).toLocaleDateString(
      "es-AR",
      options
    );

    return `${formattedDate} `;
  };
  reservas.map((reserva) => console.log(reserva));
  return (
    <main>
      <Nav></Nav>

      <div className="mt-3 d-flex justify-content-center">
        <div className="text-center">
          <button className="btn" onClick={handleSignOut}>
            Cerrar sesión
          </button>
        </div>
        <div className="text-center mx-1 mb-3">
          {(userRole === "admin" || userRole === "Cancha") && (
            <Link to="/admin" className="btn">
              Gestión de predio
            </Link>
          )}
        </div>
      </div>
      <div className="container mt-5 mb-5">
        <div className="row">
          <div className="col-12 col-lg-6">
            <div className="mb-4">
              <h3 className="tahoma">Actualizar perfil</h3>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <div className="mb-3">
                <label>Nombre:</label>
                <input
                  type="text"
                  className="form-control borderRadius"
                  placeholder={displayName ?? "Agrega el campo"}
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>Nuevo correo electrónico:</label>
                <input
                  type="email"
                  className="form-control borderRadius"
                  placeholder={email ?? "Agrega el campo"}
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <button className="btn" onClick={handleUpdateProfile}>
                Actualizar
              </button>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <h4 className="text-center tahoma">Tus reservas</h4>
            <div
              className="overflow-auto"
              style={{ whiteSpace: "nowrap", height: "230px" }}
            >
              <div className="mx-3">
                {reservas.length === 0 ? (
                  <p className="text-center mt-5">No hay reservas.</p>
                ) : (
                  reservas.map((reserva, id) => (
                    <div
                      key={reserva.id}
                      className="card mx-2 mx-auto fondoBlanco mb-3"
                      style={{ width: "30rem" }}
                    >
                      <div className="card-body">
                        <h5 className="card-title">{reserva.nombreCancha}</h5>
                        <p className="card-text">
                          <i class="fa-solid fa-clock"></i>{" "}
                          {formatDate(reserva.start)}
                        </p>
                        <p className="card-text">
                          <i className="fa-solid fa-money-bill-wave"></i> $
                          {reserva.precio.length > 10
                            ? `${reserva.precio.substring(0, 10)}...`
                            : reserva.precio}
                        </p>
                        <p className="card-text">
                          <i className="fa-solid fa-location-dot"></i>{" "}
                          {reserva.ubicacion}
                        </p>

                        <button
                          className="btn"
                          onClick={() =>
                            handleDeleteReserva(reserva.IDFirebase)
                          }
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer></Footer>
    </main>
  );
}

export default Profile;
