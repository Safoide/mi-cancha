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
} from "../firebase";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import Nav from "../components/Nav";
import Footer from "../components/footer";
import logoUbicacion from "../img/ubicacion.png";
import Modal from "react-bootstrap/Modal";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

function DetallesCancha() {
  const currentDate = new Date();
  const { id } = useParams();
  const [cancha, setCancha] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventReserved, setIsEventReserved] = useState(false);
  const [IdUsuario, setIdUsuario] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [reservasLenght, setReservasLenght] = useState([]);
  const [cbuCvu, setCbuCvu] = useState("");
  const [alias, setAlias] = useState("");

  const eventsAceptados =
    cancha && cancha.events
      ? cancha.events.filter((evento) => evento.estado === "aceptada")
      : [];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const IDUsuario = user.uid;
        setIdUsuario(IDUsuario);
        console.log("ID del usuario:", IDUsuario);
      } else {
        console.log("No hay usuario autenticado.");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleEventClick = (info) => {
    setSelectedEvent(info);

    const startDateTime = new Date(info.startStr);

    if (isNaN(startDateTime.getTime())) {
      return;
    }

    const isReserved =
      cancha.events &&
      cancha.events.some((event) => {
        const eventStartDate = new Date(event.start);

        return eventStartDate.getTime() === startDateTime.getTime();
      });

    setIsEventReserved(isReserved);

    setShowModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setShowModal(false);
    setShowConfirmation(false);
    setShowPaymentModal(false);
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

        const reservasQuery = query(
          collection(db, "reservas"),
          where("canchaID", "==", id)
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
          cbuCvu: data.cbuCvu,
          alias: data.alias,
          aceptaSeña: data.aceptaSeña,
        };
        setCancha(canchaConCoordenadas);

        if (data.aceptaSeña) {
          // Actualiza los estados con los datos de CBU/CVU y Alias
          setCbuCvu(data.cbuCvu || "");
          setAlias(data.alias || "");
        }
      } catch (error) {
        console.error("Error al obtener datos de la cancha:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleDateClick = async (info) => {
    setShowModal(true);
  };

  const reservasRef = collection(db, "reservas");

  const obtenerLongitudReservas = async () => {
    try {
      const snapshot = await getDocs(reservasRef);
      const longitud = snapshot.size;
      console.log("Longitud de la colección 'reservas':", longitud);
      setReservasLenght(longitud);
    } catch (error) {
      console.error(
        "Error obteniendo la longitud de la colección 'reservas':",
        error
      );
    }
  };

  obtenerLongitudReservas();

  const confirmarEvento = async () => {
    if (!IdUsuario) {
      window.location.href = "/login";
      return;
    }

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
            estado: cancha.aceptaSeña ? "en espera" : "aceptada",
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
            console.log(reservaId);

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

            console.log("Reserva y evento agregados a la base de datos");
          } catch (error) {
            console.error("Error agregando reserva:", error);
          }
          handleCloseModal(true);

          setShowConfirmation(true);
          if (cancha.aceptaSeña) {
            setShowPaymentModal(true);
          }
        } catch (error) {
          console.error("Error al confirmar el evento:", error);
        }
      }
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
    const formattedDate = new Date(dateTimeStr).toLocaleString(
      "es-AR",
      options
    );
    return formattedDate;
  };

  return (
    <div>
      <Nav />
      <main>
        <div className="container mt-4 mb-4">
        
          {cancha && (
            <div className="row">
              <div className=" col-9 col-lg-5 mapaDetails mx-auto mb-2 mb-lg-0" >
                <APIProvider apiKey="AIzaSyCJ_pXqnNfv915IBY_ebRpFhP56uIQ6vjA">
                  <Map
                    async
                    defaultCenter={{
                      lat: cancha.coordenadas.lat,
                      lng: cancha.coordenadas.lng,
                    }}
                    defaultZoom={10}
                    gestureHandling={"greedy"}
                    disableDefaultUI={false}
                    mapId={"43376cf3449ed733"}
                  >
                    <AdvancedMarker
                      position={{
                        lat: cancha.coordenadas.lat,
                        lng: cancha.coordenadas.lng,
                      }}
                      onClick={() => setOpen(true)}
                    >
                      <Pin
                        background={"white"}
                        borderColor={"green"}
                        glyphColor={"green"}
                      />
                    </AdvancedMarker>

                    {open &&
                      selectedMarker &&
                      selectedMarker.id === cancha.id && (
                        <InfoWindow
                          position={{
                            lat: cancha.coordenadas.lat,
                            lng: cancha.coordenadas.lng,
                          }}
                        >
                          <p>{cancha.nombreCancha}</p>
                        </InfoWindow>
                      )}
                  </Map>
                </APIProvider>
              </div>
              <div className="col-lg-6 col-12 datos ms-3">
                
                <div className="row ps-3 bordeGris">
                <h2 className="tahomaTittle pt-3">{cancha.nombreCancha}</h2>
                <div className="col-6 pt-3">
                <p>
                  <strong>
                    <i className="fa-solid fa-lightbulb"></i> Luminosidad:
                  </strong>{" "}
                  {cancha.luminosidad}
                </p>
                <p>
                  <strong>
                    <i className="fa-solid fa-phone"></i> Número:
                  </strong>{" "}
                  {cancha.codigoArea} {cancha.numero}
                </p>
                <p>
                  <strong>
                    <i className="fa-solid fa-restroom"></i> Baños y vestuarios:
                  </strong>{" "}
                  {cancha.banosVestuarios ? "Sí" : "No"}
                </p>
                <p>
                  <strong>
                    <i className="fa-solid fa-futbol"></i> Deportes disponibles:
                  </strong>{" "}
                  {cancha.deportes}
                </p>
                <p>
                  <strong>
                    <i className="fa-solid fa-location-dot"></i> Ubicación:
                  </strong>{" "}
                  {cancha.ubicacion}
                </p>
                <p>
                  <strong>
                    <i className="fa-solid fa-money-bill-wave"></i> Precio por
                    hora:
                  </strong>{" "}
                  ${cancha.precio}
                </p>
                  
                
                </div>
                  <div className="col-6 pt-3">
                  <p>
                  <strong>
                    <i class="fa-solid fa-clock"></i> Desde:
                  </strong>{" "}
                  {cancha.horarioInicio} -<strong> Hasta:</strong>{" "}
                  {cancha.horarioCierre}
                </p>
                <p>
                  {cancha.aceptaSeña && (
                    <div className="col-md-12 datos">
                      <p>
                        <strong>
                          <i className="fa-solid fa-money-bill-wave"></i> Seña:
                        </strong>{" "}
                        ${cancha.precio / 2}
                      </p>
                      <p>
                        <strong>
                          <i className="fa-solid fa-credit-card"></i> CBU:
                        </strong>{" "}
                        {cbuCvu}
                      </p>
                      <p>
                        <strong>
                          <i className="fa-solid fa-user"></i> Alias:
                        </strong>{" "}
                        {alias}
                      </p>
                    </div>
                  )}
                  <strong>
                    <i className="fa-solid fa-layer-group"></i> Tipo de césped:
                  </strong>{" "}
                  {cancha.tipoDeCesped}
                </p>
                </div>
                
                    
                </div>
                
              </div>
            </div>
          )}
          {cancha && (
            <div className="row mb-5 mt-5">
              <div className="col">
                <img
                  src={cancha.url}
                  className="img-fluid"
                  alt=""
                  style={{
                    maxHeight: "350px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          )}
          <FullCalendar
            className="mb-2"
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
            validRange={{ start: currentDate.toISOString() }}
            
          />
        </div>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar reserva</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              ¿Estás seguro de que deseas reservar este horario?
              <br />
              {selectedEvent ? formatDate(selectedEvent.start) : ""}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn" onClick={handleCloseModal}>
              Cancelar
            </button>
            {!isEventReserved && (
              <button className="btn" onClick={confirmarEvento}>
                Confirmar reserva
              </button>
            )}
          </Modal.Footer>
        </Modal>
        <Modal show={showPaymentModal} onHide={handleClosePaymentModal}>
          <Modal.Header closeButton>
            <Modal.Title>Datos de pago</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Hace una transferencia a estos datos y tu reserva será aceptada
              por el dueño
            </p>
            <div>
              <p>CBU/CVU: {cbuCvu}</p>
              <p>Alias: {alias}</p>
              {cancha && <p>Precio de la seña: ${cancha.precio / 2}</p>}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn" onClick={handleClosePaymentModal}>
              Cerrar
            </button>
          </Modal.Footer>
        </Modal>
      </main>

      <Footer />
    </div>
  );
}

export default DetallesCancha;