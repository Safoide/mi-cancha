// App.js
import React, { useEffect, useState } from "react";
import { getDocs, collection, db } from "./firebase.js";
import "./App.css";
import Nav from "./components/NavLanding.js";
import { TimelineComponentPlayer } from "./components/Timeline.js";
import { TimelineComponent2 } from "./components/Timeline2.js";
import Footer from "./components/footer.js";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import lupa from "./img/buscar.png";
import mockup from "./img/mockupPrueba.png";

function App() {
  const [canchasData, setCanchasData] = useState([]);
  const { ubicacion, deporte, fecha } = useParams();
  const [filtroUbicacion, setFiltroUbicacion] = useState(ubicacion || "");
  const [filtroDeporte, setFiltroDeporte] = useState(deporte || "");
  const [filtroFecha, setFiltroFecha] = useState(fecha || "");
  const navigate = useNavigate(); // Obtiene la instancia de useHistory

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "canchas"));
        const canchasArray = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          canchasArray.push({ ...data, id: doc.id }); // Agregar id a cada objeto
        });

        const canchasAceptadas = canchasArray.filter(
          (cancha) => cancha.estado === "Aceptada"
        );

        setCanchasData(canchasAceptadas);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const buscarCanchas = () => {
    console.log(filtroUbicacion, filtroDeporte, filtroFecha);

    filtroUbicacion.toLocaleLowerCase();
    filtroDeporte.toLocaleLowerCase();
    filtroFecha.toLocaleLowerCase();

    navigate(
      `/canchas?ubicacion=${filtroUbicacion}&deporte=${filtroDeporte}&fecha=${filtroFecha}`
    );
  };

  return (
    <div>
      <Nav />
      <div className="banner">
        <div className="ms-5 marginMovil">
          <h2 className="tahomaTittle display-2 text-white slogan">Solo preocupate por jugar</h2>
          <p className="tahoma text-white fs-6 slogan2">Encontrá, reservá y jugá en tu predio favorito, tu deporte preferido en minutos.</p>
          <button class="animated-button mt-3 ">
            <svg viewBox="0 0 24 24" class="arr-2" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
              ></path>
            </svg>
            <Link to="/canchas" class="text fs-4">Ver canchas</Link>
            <span class="circle"></span>
            <svg viewBox="0 0 24 24" class="arr-1" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
              ></path>
            </svg>
          </button>
        </div>
        
      </div>

      <main>
        <section className="fondoTramaPunta">
        <div className="container">
          <div className="row">
            
            {/* Columna derecha */}
            <div className="col-md-6 imageDesaparece">
              {/* Estilo en línea */}
              <img src={mockup} alt="Mockup del lobby" className="mockup img-fluid"  />
            </div>

              {/* Columna izquierda */}
            <div className="col-md-6">
              <h2 className="mb-4 tahomaTittle display-6 mt-lg-5 mt-3">
                Organizá con facilidad
              </h2>
              <p className="tahoma mb-5 fs-4">
                En nuestra web contamos con un lobby 
                en el cual vas a poder armar los equipos a tu manera, 
                y también podés calcular los costos de cada jugador.
              </p>
              <div>
                  <button class="lobby-button mt-0 mb-5"  >
                    <Link to="/lobby">
                      Ir al lobby
                    </Link>
                    
                  </button>
                </div>
            </div>

          </div>
        </div>
        
        </section>

        
        <section className="fondoTramaPuntaVerde fondoVerde">
          <div className="container">
            <div className="row">
              {/* Columna izquierda */}
              <div className="col-md-6 text-white mb-5">
                <h2 className="mb-4 tahomaTittle display-6 text-white mt-lg-5 mt-3">
                  Registrá tu predio rápidamente
                </h2>
                <p className="tahoma mb-5 ">
                  ¿Cómo? Fácil, iniciá sesión en nuestra web, <br />
                  completá el formulario con los datos de tu predio<br /> 
                  y del resto, nos encargamos nosotros.
                </p>
                <div>
                  <button class="login-button" >
                    <Link to="/login">
                      Iniciar sesión
                    </Link>
                    
                  </button>
                </div>
              </div>

              {/* Columna derecha */}
              <div className="col-md-6 text-center lottieDesaparece">
                <lottie-player
                  src="https://lottie.host/acd8fac7-83dd-49e1-af42-c25845a5d384/ieHWnzltMg.json"
                  speed="1"
                  loop
                  autoplay
                  direction="1"
                  mode="normal"
                  style={{ width: "100%" }}
                ></lottie-player>
              </div>
            </div>
          </div>
          
        </section>
        

        <section >
          <div className="container">
          <h3 id="pap" className="tahomaTittle display-6 mt-lg-5 mt-3 text-center">Paso a paso</h3>
        
            <p className="pap2 ps-4">Jugadores</p>
            <TimelineComponentPlayer />

            <p className="pap2 ps-4">Clubes</p>
            <TimelineComponent2 />

          </div>
      
        </section>
        

        <section className=" preguntas">
          <div className="py-5">
            <div className=" preguntasSubFondo w-75 mx-auto ">
              <div id="faq" class="faq-header fw-bold sombra text-center">
                Preguntas frecuentes
              </div>

              <div class="faq-content">
                <div class="faq-question">
                  <input id="q1" type="checkbox" class="panel"></input>
                  <div class="plus">+</div>
                  <label
                    for="q1"
                    class="panel-title text-white fw-bold sombra fs-3"
                  >
                    ¿Cómo puedo reservar una cancha?
                  </label>
                  <div class="panel-content sombra fw-bold fs-4">
                    Podés reservar una cancha a través de nuestra plataforma en
                    línea. Iniciá sesión, seleccioná la cancha y el horario que
                    prefieras, y completá el proceso de reserva.
                  </div>
                </div>

                <div class="faq-question">
                  <input id="q2" type="checkbox" class="panel"></input>
                  <div class="plus">+</div>
                  <label
                    for="q2"
                    class="panel-title text-white fw-bold sombra fs-3"
                  >
                    ¿Cuáles son los deportes disponibles para alquilar canchas?
                  </label>
                  <div class="panel-content sombra fw-bold fs-4">
                    {" "}
                    Ofrecemos una variedad de deportes, como fútbol, baloncesto,
                    tenis y más. Podés verificar la disponibilidad de canchas
                    para cada deporte en nuestro buscador.
                  </div>
                </div>

                <div class="faq-question">
                  <input id="q3" type="checkbox" class="panel"></input>
                  <div class="plus">+</div>
                  <label
                    for="q3"
                    class="panel-title text-white fw-bold sombra fs-3"
                  >
                    ¿Cómo puedo cancelar una reserva?
                  </label>
                  <div class="panel-content sombra fw-bold fs-4">
                    Para cancelar una reserva, iniciá sesión en tu cuenta,
                    accedé a tus reservas y cancelá con el respectivo botón. En caso de que canceles una cancha, la seña no se te reembolsará.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer-section">
        <Footer />
      </footer>
    </div>
  );
}

export default App;
