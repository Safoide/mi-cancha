import React, { useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/footer";
import signoInterrogacion from "../img/icon/signo-de-interrogacion.png";
import "../views/Soporte.css";

function Soporte() {
  const [mostrandoRespuestas, setMostrandoRespuestas] = useState([]);

  const toggleRespuesta = (numero) => {
    setMostrandoRespuestas((prevState) => {
      const newState = [...prevState];
      const index = newState.indexOf(numero);

      if (index === -1) {
        newState.push(numero);
      } else {
        newState.splice(index, 1);
      }

      return newState;
    });
  };

  const esMostrandoRespuesta = (numero) => {
    return mostrandoRespuestas.includes(numero);
  };

  return (
    <div>
      <Nav />
      <main>
        <div id="bienvenida">
          <div className="container ">
            <h2 className="mb-3 text-center text-white">
              Preguntas Frecuentes
            </h2>
            {[1, 2, 3].map((numero) => (
              <div key={numero} className="accordion">
                <div className="accordion-item">
                  <h2 className="accordion-header" id={`heading${numero}`}>
                    <button
                      className="accordion-button collapsed fondoFAQ text-white fw-bold"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${numero}`}
                      aria-expanded="false"
                      aria-controls={`collapse${numero}`}
                      onClick={() => toggleRespuesta(numero)}
                    >
                      Pregunta {numero}
                    </button>
                  </h2>
                  <div
                    id={`collapse${numero}`}
                    className={`accordion-collapse collapse ${
                      esMostrandoRespuesta(numero) ? "show" : ""
                    }`}
                    aria-labelledby={`heading${numero}`}
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      {esMostrandoRespuesta(numero) ? (
                        renderRespuesta(numero)
                      ) : (
                        <img
                          src={signoInterrogacion}
                          alt={`Pregunta ${numero}`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <form id="chat-form" className="mt-3">
          <div className="container mx-auto text-center mb-5">
            <h3 className="text-black text-center">
              ¿Te quedaste con alguna duda? Escribinos
            </h3>

            <button
              type="submit"
              id="chat"
              className="btn mt-3 mx-auto text-center"
            >
              Ir al chat
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}

function renderRespuesta(numero) {
  switch (numero) {
    case 1:
      return (
        <div className="fondoFAQ tahoma text-white">
          <p>¿Cómo puedo reservar una cancha?</p>
          <p>
            Puedes reservar una cancha a través de nuestra plataforma en línea.
            Inicia sesión, selecciona la cancha y el horario que prefieras, y
            completa el proceso de reserva.
          </p>
        </div>
      );
    case 2:
      return (
        <div className="fondoFAQ tahoma text-white">
          <p>¿Cuáles son los deportes disponibles para alquilar canchas?</p>
          <p>
            Ofrecemos una variedad de deportes, como fútbol, baloncesto, tenis y
            más. Puedes verificar la disponibilidad de canchas para cada deporte
            en nuestra plataforma.
          </p>
        </div>
      );
    case 3:
      return (
        <div className="fondoFAQ tahoma text-white">
          <p>¿Cómo puedo cancelar una reserva?</p>
          <p>
            Para cancelar una reserva, inicia sesión en tu cuenta, accede a tus
            reservas y sigue las instrucciones para cancelar. Ten en cuenta
            nuestras políticas de cancelación.
          </p>
        </div>
      );
    default:
      return null;
  }
}

export default Soporte;
