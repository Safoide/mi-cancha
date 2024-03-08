import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getDoc,
  doc,
  db,
  updateDoc,
  auth,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "../firebase";

import Nav from "../components/Nav";
import Footer from "../components/footer";
import Modal from "react-bootstrap/Modal";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import obtenerRolDeUsuario from "../hooks/obtenerRolDeUsuario";


function Calendar() {
  const currentDate = new Date();
  const { id } = useParams();
  const [cancha, setCancha] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reservasLenght, setReservasLenght] = useState([]);
  const [showReservasModal, setShowReservasModal] = useState(false);
  const [loadingReservas, setLoadingReservas] = useState(true);
  const [reservasPendientes, setReservasPendientes] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventReserved, setIsEventReserved] = useState(false);
  const [IdUsuario, setIdUsuario] = useState(null);
  const [todasLasReservas, setTodasLasReservas] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);



  const eventsAceptados =
    cancha && todasLasReservas
      ? todasLasReservas.filter((evento) => evento.estado === "aceptada")
      : [];

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
              setUserRole(rol);
            } else {
            }
          });
    
          return user;
        });
        return () => {
          unsubscribe();
        };
      }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const IDUsuario = user.uid;
        setIdUsuario(IDUsuario);
      } else {
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleEventClick = (info) => {
    const event = info.event;


    setSelectedEvent(event);

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setShowModal(false);
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "canchas", id);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();

        const coordenadasRef = doc(db, "direcciones", id);
        const coordenadasSnap = await getDoc(coordenadasRef);
        const dataCoordenadas = coordenadasSnap.data();

        const todasLasReservasQuery = query(
          collection(db, "reservas"),
          where("canchaID", "==", id)
        );
        const todasLasReservasSnapshot = await getDocs(todasLasReservasQuery);
        const todasLasReservasData = todasLasReservasSnapshot.docs.map(
          (reservaDoc) => ({
            IDFirebase: reservaDoc.id,
            ...reservaDoc.data(),
          })
        );

        const reservasQuery = query(
          collection(db, "reservas"),
          where("canchaID", "==", id),
          where("estado", "==", "en espera")
        );
        const reservasSnapshot = await getDocs(reservasQuery);
        const reservasData = reservasSnapshot.docs.map((reservaDoc) => ({
          IDFirebase: reservaDoc.id,
          ...reservaDoc.data(),
        }));

        const canchaConCoordenadas = {
          ...data,
          coordenadas: dataCoordenadas,
          events: reservasData,
        };

        setTodasLasReservas(todasLasReservasData);
        setReservasPendientes(reservasData);
        setCancha(canchaConCoordenadas);
        setLoadingReservas(false);
      } catch (error) {
        console.error("Error al obtener datos de la cancha:", error);
      }
    };

    fetchData();
  }, [id]);


  const handleDateClick = async (info) => {
    setShowModal(true);
  };

  const confirmarEvento = async () => {
    if (selectedEvent && selectedEvent.startStr) {
      const startDateTime = new Date(selectedEvent.startStr);

      const isReserved =
        cancha.events &&
        cancha.events.some((event) => {
          const eventStartDate = new Date(event.start);
          return eventStartDate.getTime() === startDateTime.getTime();
        });

      setIsEventReserved(isReserved);
      if (!isReserved) {
        try {
          const reservasSnapshot = await getDocs(collection(db, "reservas"));
          const reservasData = reservasSnapshot.docs.map((doc) => doc.data());

          const maxId =
            reservasData.length > 0
              ? Math.max(
                  ...reservasData.map((reserva) => Number(reserva.id)),
                  0
                )
              : 0;

          const nuevoId = (maxId + 1).toString();

          const nuevaFechaEvento = {
            id: nuevoId,
            title: "Horario reservado",
            start: startDateTime.toISOString(),
            estado: "aceptada",
          };

          try {
            const reservaRef = await addDoc(collection(db, "reservas"), {
              userID: IdUsuario,
              canchaID: id,
              nombreCancha: cancha.nombreCancha,
              precio: cancha.precio,
              ubicacion: cancha.ubicacion,
              numero: cancha.numero,
              ...nuevaFechaEvento,
            });

            const reservaId = reservaRef.id;

            const nuevosEventos = [
              ...cancha.events,
              {
                ...nuevaFechaEvento,
                id: reservaId,
              },
            ];

            const reserva2Ref = doc(db, "reservas", reservaId);
            await updateDoc(reserva2Ref, { IDFirebase: reservaId });

            const canchaRef = doc(db, "canchas", id);
            await updateDoc(canchaRef, { events: nuevosEventos });
            setCancha({ ...cancha, events: nuevosEventos });

            window.location.reload()


          } catch (error) {
            console.error("Error agregando reserva:", error);
          }
        } catch (error) {
          console.error("Error al confirmar el evento:", error);
        }
      }
    }

    handleCloseModal(true);
  };

  const reservasRef = collection(db, "reservas");

  const obtenerLongitudReservas = async () => {
    try {
      const snapshot = await getDocs(reservasRef);
      const longitud = snapshot.size;
      setReservasLenght(longitud);
    } catch (error) {
      console.error(
        "Error obteniendo la longitud de la colección 'reservas':",
        error
      );
    }
  };

  obtenerLongitudReservas();

  const eliminarEvento = async () => {

    if (selectedEvent && selectedEvent.id) {
      try {
        const reservaQuery = query(
          collection(db, "reservas"),
          where("id", "==", selectedEvent.id),
          where("canchaID", "==", id)
        );

        const reservaSnapshot = await getDocs(reservaQuery);

        if (!reservaSnapshot.empty) {
          const reservaDoc = reservaSnapshot.docs[0];
          await deleteDoc(reservaDoc.ref);

          window.location.reload()
        } else {

        }
      } catch (error) {
        console.error("Error eliminando evento:", error);
      }
    }

    handleCloseModal();

    window.location.reload();
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
    const formattedDate = new Date(dateTimeStr).toLocaleString(
      "es-AR",
      options
    );
    return formattedDate;
  };

  const cambiarEstadoReserva = async (reservaId, nuevoEstado) => {
    try {
      const reservaRef = doc(db, "reservas", reservaId);
      await updateDoc(reservaRef, { estado: nuevoEstado });

      const reservasQuery = query(
        collection(db, "reservas"),
        where("canchaID", "==", id),
        where("estado", "==", "en espera")
      );
      const reservasSnapshot = await getDocs(reservasQuery);
      const reservasData = reservasSnapshot.docs.map((reservaDoc) => ({
        IDFirebase: reservaDoc.id,
        ...reservaDoc.data(),
      }));

      setReservasPendientes(reservasData);
      window.location.reload()

    } catch (error) {
      console.error("Error cambiando el estado de la reserva:", error);
    }
  };

  return (
    <div>
      <Nav />
      <main>
        <div className="container mt-4 mb-4">
          <Link className="btn mb-3" to="/admin">
            Volver
          </Link>
          {cancha && cancha.aceptaSeña && (
            <button
              className="btn mb-3 mx-2"
              onClick={() => setShowReservasModal(true)}
            >
              Ver reservas pendientes
            </button>
          )}

          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            locale={esLocale}
            initialView="timeGridWeek"
            initialDate={currentDate.toISOString()}
            selectable="true"
            events={eventsAceptados}
            dateClick={(info) => handleDateClick(info)}
            eventClick={(info) => handleEventClick(info)}
            select={(info) => {
              setSelectedEvent(info);
            }}
            slotMinTime={
              cancha && cancha.horarioInicio ? cancha.horarioInicio : "08:00:00"
            }
            slotMaxTime={
              cancha && cancha.horarioCierre ? cancha.horarioCierre : "20:00:00"
            }
          />
        </div>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar reserva</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isEventReserved ? (
              <p>Este horario ya está reservado.</p>
            ) : (
              <>
                ¿Estás seguro de que deseas editar este horario?
                <br />
                {selectedEvent ? formatDate(selectedEvent.start) : ""}
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button className="btn" onClick={handleCloseModal}>
              Cancelar
            </button>
            {!isEventReserved && (
              <>
                <button className="btn" onClick={confirmarEvento}>
                  Confirmar reserva
                </button>
                <button className="btn" onClick={eliminarEvento}>
                  Eliminar evento
                </button>
              </>
            )}
          </Modal.Footer>
        </Modal>

        <Modal
          show={showReservasModal}
          onHide={() => setShowReservasModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Reservas pendientes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {reservasPendientes.length > 0 ? (
              reservasPendientes
                .filter((reserva) => reserva.estado === "en espera")
                .map((reserva) => (
                  <div key={reserva.IDFirebase} className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">{reserva.title}</h5>
                      <p className="card-text">
                        Fecha: {formatDate(reserva.start)}
                      </p>
                      <p className="card-text">Usuario: {reserva.userID}</p>
                      <select
                        className="form-select"
                        value={reserva.estado}
                        onChange={(e) =>
                          cambiarEstadoReserva(
                            reserva.IDFirebase,
                            e.target.value
                          )
                        }
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="aceptada">Aceptada</option>
                        <option value="rechazada">Rechazada</option>
                      </select>
                    </div>
                  </div>
                ))
            ) : (
              <p>No hay reservas pendientes.</p>
            )}
          </Modal.Body>
        </Modal>
      </main>
      <Footer />
    </div>
  );
}

export default Calendar;