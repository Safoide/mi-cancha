import React, { useState, useEffect } from "react";
import {
  db,
  doc,
  auth,
  createUserWithEmailAndPassword,
  setDoc,
  collection,
  getDocs,
  ref,
  updateDoc,
} from "../firebase.js";

import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  getStorage,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

import axios from "axios";
import Nav from "../components/Nav.js";
import Footer from "../components/footer.js";
import validator from "validator";

const storage = getStorage();

const RegisterCancha = () => {
  const [nombreCancha, setNombreCancha] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [luminosidad, setLuminosidad] = useState("Si");
  const [precio, setPrecio] = useState("");
  const [banosVestuarios, setBanosVestuarios] = useState(false);
  const [suelosInput, setSuelosInput] = useState([]);
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [DNI, setDNI] = useState("");
  const [codigoArea, setCodigoArea] = useState("");
  const [numero, setNumero] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [deportesInput, setDeportesInput] = useState([]);
  const [selectedDeporte, setSelectedDeporte] = useState("");
  const [selectedSuelo, setSelectedSuelo] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [aceptaSeña, setAceptaSeña] = useState(false);
  const [cbuCvu, setCbuCvu] = useState("");
  const [alias, setAlias] = useState("");
  const [UidCancha, setUidCancha] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [urls, setUrls] = useState([]);
  const [canchasLenght, setCanchasLenght] = useState([]);
  const [errorNombreCancha, setErrorNombreCancha] = useState(null);
  const [errorUbicacion, setErrorUbicacion] = useState(null);
  const [errorSelectedDeporte, setErrorSelectedDeporte] = useState(null);
  const [errorPrecio, setErrorPrecio] = useState(null);
  const [errorSelectedSuelo, setErrorSelectedSuelo] = useState(null);
  const [errorNombreCompleto, setErrorNombreCompleto] = useState(null);
  const [errorDNI, setErrorDNI] = useState(null);
  const [errorCodigoArea, setErrorCodigoArea] = useState(null);
  const [errorNumero, setErrorNumero] = useState(null);
  const [ErrorCoordenadas, setErrorCoordenadas] = useState(null);

  const [horarioInicio, setHorarioInicio] = useState("08:00");
  const [horarioCierre, setHorarioCierre] = useState("20:00");

  const [user, setUser] = useState(null);

  const listaCodigosArea = [
    { codigo: "+55", pais: "Brasil" },
    { codigo: "+591", pais: "Bolivia" },
    { codigo: "+54", pais: "Argentina" },
    { codigo: "+57", pais: "Colombia" },
    { codigo: "+593", pais: "Ecuador" },
    { codigo: "+595", pais: "Paraguay" },
    { codigo: "+51", pais: "Perú" },
    { codigo: "+598", pais: "Uruguay" },
    { codigo: "+58", pais: "Venezuela" },
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const obtenerSuelos = async () => {
      try {
        const suelosCollection = collection(db, "suelos");
        const suelosSnapshot = await getDocs(suelosCollection);

        const suelosData = suelosSnapshot.docs.map((doc) => ({
          id: doc.id,
          nombre: doc.data().nombre,
        }));
        setSuelosInput(suelosData);
      } catch (error) {}
    };

    obtenerSuelos();
  }, []);

  useEffect(() => {
    const obtenerDeportes = async () => {
      try {
        const deportesCollection = collection(db, "deportes");
        const deportesSnapshot = await getDocs(deportesCollection);

        const deportesData = deportesSnapshot.docs.map((doc) => ({
          id: doc.id,
          nombre: doc.data().nombre,
        }));
        setDeportesInput(deportesData);
      } catch (error) {}
    };

    obtenerDeportes();
  }, []);

  const obtenerCoordenadas = async () => {
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          ubicacion
        )}&key=66a1d01ec9554f938163e9294ba011b2`
      );

      const { results } = response.data;

      if (results.length > 0) {
        const { lat, lng } = results[0].geometry;
        setErrorCoordenadas("La ubicación fue guardada con exito");
        setCoordinates({ lat, lng });
      } else {
        setErrorCoordenadas(
          "No se encontraron coordenadas para esta dirección, vuelva a escribirla correctamente."
        );
      }
    } catch (error) {}
  };

  const handleRegisterCancha = async (e) => {
    e.preventDefault();

    if (
      !validator.isLength(nombreCancha, { max: 50 }) ||
      validator.isEmpty(nombreCancha)
    ) {
      setErrorNombreCancha(
        "El nombre de la cancha debe tener hasta 50 caracteres y no puede estar vacío"
      );
      return;
    } else {
    }

    if (
      !validator.isLength(ubicacion, { max: 250 }) ||
      validator.isEmpty(ubicacion)
    ) {
      setErrorUbicacion(
        "La ubicación debe tener hasta 250 caracteres y no puede estar vacía"
      );
      return;
    } else {
      setErrorUbicacion(null);
    }

    if (validator.isEmpty(selectedDeporte)) {
      setErrorSelectedDeporte("Debes seleccionar al menos un deporte");
      return;
    } else {
      setErrorSelectedDeporte(null);
    }

    if (validator.isEmpty(precio)) {
      setErrorPrecio("El precio por hora no puede estar vacío");
      return;
    } else {
      setErrorPrecio(null);
    }

    if (validator.isEmpty(selectedSuelo)) {
      setErrorSelectedSuelo("Debes seleccionar un tipo de suelo");
      return;
    } else {
      setErrorSelectedSuelo(null);
    }

    if (
      !validator.isLength(nombreCompleto, { max: 100 }) ||
      validator.isEmpty(nombreCompleto)
    ) {
      setErrorNombreCompleto(
        "El nombre completo debe tener hasta 100 caracteres y no puede estar vacío"
      );
      return;
    } else {
      setErrorNombreCompleto(null);
    }

    if (!validator.isLength(DNI, { max: 8 }) || validator.isEmpty(DNI)) {
      setErrorDNI(
        "El DNI debe tener hasta 8 caracteres y no puede estar vacío"
      );
      return;
    } else {
      setErrorDNI(null);
    }

    if (
      validator.isEmpty(codigoArea) ||
      !validator.isLength(numero, { max: 10 }) ||
      validator.isEmpty(numero)
    ) {
      setErrorCodigoArea(
        "Debes seleccionar un código de área y el número de teléfono no puede estar vacío y debe tener hasta 10 caracteres"
      );
      return;
    } else {
      setErrorCodigoArea(null);
      setErrorNumero(null);
    }

    try {
      let uid;

      if (user) {
        uid = user.uid;
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        uid = userCredential.user.uid;
      }

      const direccionDoc = doc(db, "direcciones", uid);

      await obtenerCoordenadas();

      if (coordinates) {
        let docRef = await setDoc(doc(db, "direcciones", uid), {
          estado: "En espera",
          lat: coordinates.lat,
          lng: coordinates.lng,
        });

        docRef = await setDoc(doc(db, "usuarios", uid), {
          nombreCompleto: nombreCompleto,
          correo: email,
          rol: "Cancha",
        });

        docRef = await setDoc(doc(db, "canchas", uid), {
          nombreCancha,
          ubicacion,
          deportes: [selectedDeporte],
          luminosidad,
          banosVestuarios,
          precio,
          nombreCompleto: nombreCompleto,
          tipoDeCesped: selectedSuelo,
          horarioInicio: `${horarioInicio}:00`,
          horarioCierre: `${horarioCierre}:00`,
          email,
          DNI,
          codigoArea,
          numero,
          url: urls,
          estado: "En espera",
          aceptaSeña,
          cbuCvu,
          alias,
        });

        setUidCancha(uid);

        docRef = doc(db, "canchas", uid);
        await updateDoc(docRef, {
          coordenadas: { lat: coordinates.lat, lng: coordinates.lng },
        });

        await updateDoc(direccionDoc, {
          nombreCancha: nombreCancha,
          idCancha: uid,
        });

        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    } catch (error) {}
  };

  const CanchasRef = collection(db, "canchas");

  const obtenerLongitudCanchas = async () => {
    try {
      const snapshot = await getDocs(CanchasRef);
      const longitud = snapshot.size;
      setCanchasLenght(longitud);
    } catch (error) {}
  };

  obtenerLongitudCanchas();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    try {
      const storageReference = storageRef(
        storage,
        `canchas/${canchasLenght + 1}/${file.name}`
      );
      await uploadBytes(storageReference, file);

      const downloadURL = await getDownloadURL(storageReference);
      setImageURL(downloadURL);
      console.log(downloadURL);
      setUrls((prevUrls) => [...prevUrls, downloadURL]);
    } catch (error) {}
  };

  return (
    <main>
      <Nav />

      <div className="container mt-3 mb-5 ">
        <h2 className="text-center fw-bold display-4 mb-4">
          Registro de cancha
        </h2>
        <form
          id="registerCancha"
          onSubmit={handleRegisterCancha}
          className="w-50 mx-auto"
        >
          <div className="mb-3">
            <label htmlFor="nombreCancha" className="form-label fw-bold fs-5">
              Nombre de la cancha
            </label>
            <input
              type="text"
              className="form-control borderRadius"
              id="nombreCancha"
              value={nombreCancha}
              onChange={(e) => setNombreCancha(e.target.value)}
              required
            />
            {errorNombreCancha && (
              <p style={{ color: "red" }}>{errorNombreCancha}</p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="ubicacion" className="form-label fw-bold fs-5">
              Ubicación{" "}
              <span className="fw-light">
                (Una vez colocada guardá antes de continuar)
              </span>
            </label>
            <div className="input-group">
              <input
                type="text"
                className="form-control ubicacionInput"
                id="ubicacion"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                required
              />

              <button
                type="button"
                className="btn-outline-secondary w-5 showPassword btn-outline-secondary"
                onClick={obtenerCoordenadas}
              >
                <i class="fas fa-save"></i>
              </button>
            </div>
            {errorUbicacion && <p style={{ color: "red" }}>{errorUbicacion}</p>}
            {ErrorCoordenadas && (
              <p style={{ color: "green" }}>{ErrorCoordenadas}</p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="deportes" className="form-label fw-bold fs-5">
              Deportes disponibles
            </label>
            <select
              className="form-select borderRadius"
              id="deportes"
              value={selectedDeporte}
              onChange={(e) => setSelectedDeporte(e.target.value)}
            >
              <option value="" disabled>
                Selecciona un deporte
              </option>
              {deportesInput.map((deporte) => (
                <option key={deporte.id} value={deporte.nombre}>
                  {deporte.nombre}
                </option>
              ))}
              {errorSelectedDeporte && (
                <p style={{ color: "red" }}>{errorSelectedDeporte}</p>
              )}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="aceptaSeña" className="form-label fw-bold fs-5">
              ¿Acepta seña?
            </label>
            <div className="form-check">
              <input
                className="form-check-input borderRadius"
                type="checkbox"
                id="aceptaSeña"
                checked={aceptaSeña}
                onChange={(e) => setAceptaSeña(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="aceptaSeña">
                Sí, aceptamos seña
              </label>
            </div>
          </div>
          {aceptaSeña && (
            <>
              <div className="mb-3">
                <label htmlFor="cbuCvu" className="form-label fw-bold fs-5">
                  CBU/CVU
                </label>
                <input
                  type="number"
                  className="form-control borderRadius"
                  id="cbuCvu"
                  value={cbuCvu}
                  onChange={(e) => setCbuCvu(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="alias" className="form-label fw-bold fs-5">
                  Alias
                </label>
                <input
                  type="text"
                  className="form-control borderRadius"
                  id="alias"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          <div>
            <label className="form-label fw-bold fs-5">
              Horario de inicio:
            </label>
            <input
              className="form-control border-radius"
              type="time"
              value={horarioInicio}
              onChange={(e) => setHorarioInicio(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label fw-bold fs-5">
              Horario de cierre:
            </label>
            <input
              className="form-control border-radius"
              type="time"
              value={horarioCierre}
              onChange={(e) => setHorarioCierre(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="luminosidad" className="form-label fw-bold fs-5">
              Luminosidad
            </label>
            <select
              className="form-select borderRadius"
              id="luminosidad"
              value={luminosidad}
              onChange={(e) => setLuminosidad(e.target.value)}
            >
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>
          </div>
          {}
          <div className="mb-3">
            <label htmlFor="precio" className="form-label fw-bold fs-5">
              Precio por hora
            </label>
            <input
              type="number"
              className="form-control borderRadius"
              id="precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
            {errorPrecio && <p style={{ color: "red" }}>{errorPrecio}</p>}
          </div>
          <div className="mb-3">
            <label
              htmlFor="bañosVestuarios"
              className="form-label fw-bold fs-5"
            >
              Baños y vestuarios
            </label>
            <div className="form-check">
              <input
                className="form-check-input borderRadius"
                type="checkbox"
                value="Si"
                id="bañosVestuarios"
                checked={banosVestuarios}
                onChange={(e) => setBanosVestuarios(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="bañosVestuarios">
                Sí, disponemos de baños y vestuarios
              </label>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="tipoDeCesped" className="form-label fw-bold fs-5">
              Tipo de suelo
            </label>
            <select
              className="form-select borderRadius"
              id="tipoDeCesped"
              value={selectedSuelo}
              onChange={(e) => setSelectedSuelo(e.target.value)}
            >
              <option value="" disabled>
                Selecciona un tipo de suelo
              </option>
              {suelosInput.map((suelo) => (
                <option key={suelo.id} value={suelo.nombre}>
                  {suelo.nombre}
                </option>
              ))}
            </select>
            {errorSelectedSuelo && (
              <p style={{ color: "red" }}>{errorSelectedSuelo}</p>
            )}
          </div>

          <h2>Datos del dueño</h2>
          <div className="mb-3">
            <label htmlFor="NombreCompleto" className="form-label fw-bold fs-5">
              Nombre completo
            </label>
            <input
              type="text"
              className="form-control borderRadius"
              id="NombreCompleto"
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              required
            />
            {errorNombreCompleto && (
              <p style={{ color: "red" }}>{errorNombreCompleto}</p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="DNI" className="form-label fw-bold fs-5">
              DNI
            </label>
            <input
              type="number"
              className="form-control borderRadius"
              id="DNI"
              value={DNI}
              onChange={(e) => setDNI(e.target.value)}
              required
            />
            {errorDNI && <p style={{ color: "red" }}>{errorDNI}</p>}
          </div>
          <div className="mb-3">
            <label htmlFor="codigoArea" className="form-label fw-bold fs-5">
              Código de área
            </label>
            <div className="d-flex">
              <select
                className="form-select w-25 borderRadius"
                id="codigoArea"
                value={codigoArea}
                onChange={(e) => setCodigoArea(e.target.value)}
                required
              >
                <option value="" disabled>
                  Selecciona un código de área
                </option>
                {listaCodigosArea.map((codigo) => (
                  <option key={codigo.codigo} value={codigo.codigo}>
                    {`${codigo.codigo} - ${codigo.pais}`}
                  </option>
                ))}
              </select>

              <input
                type="number"
                className="form-control w-50 borderRadius"
                placeholder="Número de contacto"
                id="numero"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
              />
            </div>
            {errorCodigoArea && (
              <p style={{ color: "red" }}>{errorCodigoArea}</p>
            )}
            {errorNumero && <p style={{ color: "red" }}>{errorNumero}</p>}
          </div>
          {!user && (
            <>
              <div className="mb-3">
                <label htmlFor="Email" className="form-label fw-bold fs-5">
                  Email
                </label>
                <input
                  type="text"
                  className="form-control borderRadius"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="passwordRegistro"
                  className="form-label fw-bold fs-5"
                >
                  Contraseña*
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ borderRadius: "0px 16px 16px 0px !important;" }}
                  />
                  <button
                    type="button"
                    className=" btn-outline-secondary showPassword"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i
                      className={`fa ${
                        showPassword ? "fa-eye" : "fa-eye-slash"
                      }`}
                    ></i>
                  </button>
                </div>
              </div>
            </>
          )}
          <div className="mb-3">
            <label className="form-label fw-bold fs-5" for="customFile">
              Subí la imagen del predio
            </label>
            <input
              type="file"
              className="form-control"
              id="customFile"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </div>

          <button type="submit" className="lobby-button fs-6 ">
            Enviar
          </button>
        </form>
        <div
          id="error-message"
          className="text-center"
          style={{ color: "green" }}
        ></div>{" "}
      </div>
      <Footer />
    </main>
  );
};

export default RegisterCancha;
