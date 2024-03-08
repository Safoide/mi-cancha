import React, { useEffect, useState } from "react";
import Nav from "../components/Nav";
import { Link } from "react-router-dom";
import Footer from "../components/footer";
import logoUbicacion from "../img/ubicacion.png";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { getDocs, collection, db } from "../firebase";

const Home = () => {
  const [canchas, setCanchas] = useState([]);
  const [coordenadas, setCoordenadas] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "canchas"));
        const canchasData = [];
        const coordenadasData = [];

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
            url: data.url,
            estado: data.estado || "En espera",
          });
        });

        const canchasAceptadas = canchasData.filter(
          (cancha) => cancha.estado === "Aceptada"
        );

        const querySnapshotCoordenadas = await getDocs(
          collection(db, "direcciones")
        );
        querySnapshotCoordenadas.forEach((doc) => {
          const data = doc.data();
          coordenadasData.push(data);
        });

        setCanchas(canchasAceptadas);
        setCoordenadas(coordenadasData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(canchas.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = canchas.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const defaultCenter = {
    lat: -34.6037389,
    lng: -58.3815704,
  };

  const handleMarkerClick = (coordenada) => {
    setSelectedMarker(coordenada);
  };

  const handleCloseInfoWindow = () => {
    setSelectedMarker(null);
  };

  return (
    <div className="w-100">
      <Nav />

      <main>
        <section className="container-fluid pe-0">
          <div className="row ">
            <div className="col-md-6 alturaMapa responsiveList">
              <APIProvider apiKey="AIzaSyCJ_pXqnNfv915IBY_ebRpFhP56uIQ6vjA">
                <Map
                  async
                  defaultCenter={{
                    lat: defaultCenter.lat,
                    lng: defaultCenter.lng,
                  }}
                  defaultZoom={10}
                  gestureHandling={"greedy"}
                  disableDefaultUI={false}
                  mapId={"43376cf3449ed733"}
                >
                  {coordenadas.map((coordenada, index) => (
                    <AdvancedMarker
                      key={index}
                      position={{ lat: coordenada.lat, lng: coordenada.lng }}
                      onClick={() => handleMarkerClick(coordenada)}
                    >
                      <Pin
                        background={"white"}
                        borderColor={"green"}
                        glyphColor={"green"}
                      />
                      {selectedMarker &&
                        selectedMarker.id === coordenada.id && (
                          <InfoWindow
                            position={{
                              lat: coordenada.lat,
                              lng: coordenada.lng,
                            }}
                            onCloseClick={handleCloseInfoWindow}
                          >
                            <div>
                              <p>{coordenada.nombreCancha}</p>
                              <Link to={"/details/" + coordenada.idCancha}>
                                Ir a la cancha
                              </Link>
                            </div>
                          </InfoWindow>
                        )}
                    </AdvancedMarker>
                  ))}
                </Map>
              </APIProvider>
            </div>
            <div className="col-md-6 mt-lg-0 responsiveList">
              <div className="row justify-content-center">
                <div className="col-12 col-md-10">
                  <div className="row row-cols-1 g-4 mb-4">
                    <h2 className="tahomaTittle mt-5">Listado de canchas</h2>
                    {currentItems.map((cancha) => (
                      <div key={cancha.id} className="col mt-4">
                        <Link to={"/details/" + cancha.id}>
                          <div className="card fondoBlanco h-100 d-flex align-items-start">
                            <div className="row">
                              <div className="col-auto">
                                <img
                                  src={cancha.url}
                                  alt={cancha.nombreCancha}
                                  className="img-fluid custom-image"
                                />
                              </div>
                              <div className="col  w-100">
                                <h5 className="card-title mt-1 fs-4 fw-bold truncate-text">
                                  {cancha.nombreCancha}
                                </h5>
                                <p className="truncate-text">
                                  <i className="fa-solid fa-person-running"></i>
                                  <span className="text-secondary">
                                    {" "}
                                    {cancha.deportes}
                                  </span>
                                </p>
                                <p className="truncate-text">
                                  <strong>
                                    <i className="fa-solid fa-location-dot"></i>
                                  </strong>{" "}
                                  <span className="text-secondary">
                                    {" "}
                                    {cancha.ubicacion}
                                  </span>
                                </p>
                                <p className="truncate-text mb-0">
                                  <strong>
                                    <i className="fa-solid fa-money-bill-wave"></i>{" "}
                                  </strong>{" "}
                                  <span className="text-secondary">
                                    <strong className="text-dark">
                                      {" "}
                                      ${cancha.precio}
                                    </strong>{" "}
                                    x hora
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                  <nav className="pt-3">
                    <ul className="pagination">
                      {currentPage > 1 && (
                        <li className="page-item">
                          <button
                            className="page-link"
                            onClick={() => paginate(currentPage - 1)}
                          >
                            {"<"}
                          </button>
                        </li>
                      )}
                      {Array.from({ length: totalPages }, (_, index) => (
                        <li
                          key={index}
                          className={`page-item ${
                            currentPage === index + 1 ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => paginate(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      {currentPage < totalPages && (
                        <li className="page-item">
                          <button
                            className="page-link"
                            onClick={() => paginate(currentPage + 1)}
                          >
                            {">"}
                          </button>
                        </li>
                      )}
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
