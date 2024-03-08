import React, { useState, useEffect } from "react";
import {
  auth,
  getDocs,
  collection,
  db,
  deleteDoc,
  doc,
  updateDoc,
} from "../../firebase";
import { Link } from "react-router-dom";
import NavAll from "../../components/Nav";
import Footer from "../../components/footer";
import obtenerRolDeUsuario from "../../hooks/obtenerRolDeUsuario";
import Modal from "react-bootstrap/Modal";
import enviarCanchaDefault from "../../hooks/canchaDefault";

const AdminCanchas = () => {
  const [canchas, setCanchas] = useState([]);
  const [selectedCancha, setSelectedCancha] = useState(null);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleShowDeleteModal = (cancha) => {
    setSelectedCancha(cancha);
    setShowDeleteModal(true);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);

      if (user == null) {
        window.location.href = "/";
      }

      obtenerRolDeUsuario(user.uid).then((rol) => {

        if (rol === "usuario") {
          window.location.href = "/";
        } else if (rol === "admin") {
          fetchData();
          setUserRole(rol);
        } else {
          fetchUserCanchas(user.uid);
        }
      });

      return user;
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "canchas"));
      const canchasData = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        canchasData.push({
          id: doc.id,
          nombreCancha: data.nombreCancha,
          deportes: data.deportes,
          codigoArea: data.codigoArea,
          numero: data.numero,
          banosVestuarios: data.banosVestuarios,
          ubicacion: data.ubicacion,
          tipoDeCesped: data.tipoDeCesped,
          precio: data.precio,
          estado: data.estado || "En espera",
        });
      });

      setCanchas(canchasData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchUserCanchas = async (uid) => {
    try {
      const querySnapshot = await getDocs(collection(db, "canchas"));
      const canchasData = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (doc.id === uid) {
          canchasData.push({
            id: doc.id,
            nombreCancha: data.nombreCancha,
            deportes: data.deportes,
            codigoArea: data.codigoArea,
            numero: data.numero,
            banosVestuarios: data.banosVestuarios,
            ubicacion: data.ubicacion,
            tipoDeCesped: data.tipoDeCesped,
            precio: data.precio,
            estado: data.estado || "En espera",
          });
        }
      });

      setCanchas(canchasData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteCancha = async () => {
    if (selectedCancha) {
      const docRef = doc(db, "canchas", selectedCancha.id);
      const direccionRef = doc(db, "direcciones", selectedCancha.id);
      try {
        await deleteDoc(docRef);
        await deleteDoc(direccionRef);

        const updatedCanchas = canchas.filter(
          (c) => c.id !== selectedCancha.id
        );
        setCanchas(updatedCanchas);

        setDeleteMessage(`¡La cancha ha sido eliminada correctamente!`);

        setTimeout(() => {
          setShowDeleteModal(false);
          setSelectedCancha(null);
          setDeleteMessage(""); 
        }, 2000);
      } catch (error) {
        console.error("Error al eliminar la cancha:", error);

        setDeleteMessage(
          "¡Ops! Algo salió mal al intentar eliminar la cancha. Por favor, inténtalo de nuevo."
        );

        setTimeout(() => {
          setShowDeleteModal(false);
          setSelectedCancha(null);
          setDeleteMessage(""); 
        }, 2000);
      }
    }
  };

  const handleCloseDeleteModal = () => {
    // Limpia el mensaje de la modal
    setDeleteMessage("");

    // Cierra la modal sin eliminar la cancha
    setShowDeleteModal(false);
    setSelectedCancha(null);
  };

  const handleExitedDeleteModal = () => {
    // Después de salir de la modal, si hay un mensaje, realiza la acción de eliminar
    if (deleteMessage) {
      handleDeleteCancha();
    }
  };

  const handleEstadoChange = async (event, canchaId) => {
    const nuevoEstado = event.target.value;
    try {
      const docRef = doc(db, "canchas", canchaId);
      await updateDoc(docRef, { estado: nuevoEstado });

      const coordenadaRef = doc(db, "direcciones", canchaId);
      await updateDoc(coordenadaRef, { estado: nuevoEstado });

      const updatedCanchas = canchas.map((c) =>
        c.id === canchaId ? { ...c, estado: nuevoEstado } : c
      );
      setCanchas(updatedCanchas);
    } catch (error) {
      console.error("Error al actualizar el estado de la cancha:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Actualizar el término de búsqueda al cambiar el valor del input
  };

  const filteredCanchas = canchas.filter((cancha) =>
    cancha.nombreCancha.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <NavAll></NavAll>
      <div className="text-center mx-auto m-3 d-flex justify-content-center">
        <div className="mx-2">
          <Link to="/profile" className="btn ">
            Volver al perfil
          </Link>
        </div>
      </div>

      <div className=" mx-auto m-3 d-flex justify-content-center">
        <div className="mx-2">
          <label className="tahoma fs-4 text-dark text-start" for="buscador">Buscador <i class="fa-solid fa-magnifying-glass"></i></label>
            <input
              id="buscador"
              type="text"
              placeholder="Nombre de la cancha"
              className="form-control"
              value={searchTerm}
              onChange={handleSearchChange}
            />
        </div>
      </div>
      <main className="mb-5">
        <h2 className="text-center">Canchas registradas</h2>
        <div className="container d-flex flex-wrap justify-content-center">
          {filteredCanchas.map((cancha) => (
            <div key={cancha.id} className="card mx-3 my-3" style={{ width: "18rem" }}>
              <div className="card-body">
                <h5 className="card-title">{cancha.nombreCancha}</h5>
                <p className="card-text ">
                  <span className="fw-bold"> Baños y vestuarios:</span>  {cancha.banosVestuarios ? "Si" : "No"}
                </p>

                <p className="card-text"><span className="fw-bold"> Deportes: </span> {cancha.deportes}</p>
                <p className="card-text">
                <span className="fw-bold">Número:</span>
                   {cancha.codigoArea} {cancha.numero}
                </p>
                <p className="card-text"><span className="fw-bold">Ubicación: </span>    
                {cancha.ubicacion.length > 12
                  ? `${cancha.ubicacion.substring(0, 12)}...`
                  : cancha.ubicacion
                }</p>
                <p className="card-text">
                <span className="fw-bold">Precio por hora:</span>
                   ${cancha.precio}
                </p>
                <p className="card-text"> <span className="fw-bold">Césped:</span> {cancha.tipoDeCesped}</p>
                {userRole === "admin" && (
                  <div className="mb-3">
                    <label htmlFor="estado" className="form-label fw-bold text-black">
                      Estado:
                    </label>
                    <select
                      className="form-select"
                      id="estado"
                      value={cancha.estado}
                      onChange={(event) =>
                        handleEstadoChange(event, cancha.id)
                      }
                    >
                      <option value="En espera">En espera</option>
                      <option value="Aceptada">Aceptada</option>
                      <option value="Rechazada">Rechazada</option>
                    </select>
                  </div>
                )}
                <div className="d-flex justify-content-center">
                  <div className="mx-2">
                    <Link
                      to={"/admin/editar/" + cancha.id}
                      className="btn editar-button"
                    >
                      Editar
                    </Link>

                  </div>
                  {userRole === "admin" && (
                    <div className="mx-2">
                      <button
                        className="btn  eliminar-button"
                        onClick={() => handleShowDeleteModal(cancha)}
                      >
                        Eliminar
                      </button>
                    </div>                    
                  )}

                </div>
                  <div className="text-center">
                  <Link to={"/admin/calendar/" + cancha.id} className="btn mt-2 text-center">
                      Calendario
                    </Link>
                  </div>
                <Modal
                  show={showDeleteModal}
                  onHide={handleCloseDeleteModal}
                  onExited={handleExitedDeleteModal}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {deleteMessage ? (
                      <p>{deleteMessage}</p>
                    ) : (
                      <p>
                        ¿Estás seguro de que quieres eliminar la cancha{" "}
                        <strong>{selectedCancha?.nombreCancha}</strong>?
                      </p>
                    )}
                  </Modal.Body>
                  <Modal.Footer>
                    {deleteMessage === "" && (
                      <button
                        className="btn"
                        onClick={handleCloseDeleteModal}
                      >
                        Cancelar
                      </button>
                    )}

                    {!deleteMessage && (
                      <button className="btn" onClick={handleDeleteCancha}>
                        Eliminar
                      </button>
                    )}
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer></Footer>
    </div>
  );
};

export default AdminCanchas;
