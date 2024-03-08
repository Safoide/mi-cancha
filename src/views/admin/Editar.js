import React, { useState, useEffect } from "react";
import {
  doc,
  db,
  updateDoc,
  getDoc,
  getDocs,
  collection,
  auth,
} from "../../firebase";
import validator from "validator";
import Nav from "../../components/Nav";
import { useParams, Link } from "react-router-dom";
import Footer from "../../components/footer";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  getStorage,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";
import obtenerRolDeUsuario from "../../hooks/obtenerRolDeUsuario";

const storage = getStorage();

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

const EditarCancha = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nombreCancha: "",
    deportes: "",
    codigoArea: "",
    numero: "",
    banosVestuarios: "",
    ubicacion: "",
    precio: "",
    tipoDeCesped: "",
  });

  const [deportesOptions, setDeportesOptions] = useState([]);
  const [suelosOptions, setSuelosOptions] = useState([]);
  const [imageURL, setImageURL] = useState("");
  const [urls, setUrls] = useState([]);
  const [user, setUser] = useState(null);
  const [aceptaSeña, setAceptaSeña] = useState(false);
  const [errorNombreCancha, setErrorNombreCancha] = useState(null);
  const [errorSelectedDeporte, setErrorSelectedDeporte] = useState(null);
  const [errorPrecio, setErrorPrecio] = useState(null);
  const [errorSelectedSuelo, setErrorSelectedSuelo] = useState(null);
  const [errorCodigoArea, setErrorCodigoArea] = useState(null);
  const [errorNumero, setErrorNumero] = useState(null);
  const [userRole, setUserRole] = useState(null);

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
    const obtenerDatosCancha = async () => {
      try {
        const docRef = doc(db, "canchas", id);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();

        setFormData({
          nombreCancha: data.nombreCancha,
          deportes: data.deportes,
          codigoArea: data.codigoArea,
          numero: data.numero,
          precio: data.precio,
          aceptaSeña: data.aceptaSeña,
          tipoDeCesped: data.tipoDeCesped,
          banosVestuarios: data.banosVestuarios || "si",
          luminosidad: data.luminosidad || "si",
          cbuCvu: data.cbuCvu,
          alias: data.alias,
        });
        setAceptaSeña(data.aceptaSeña || false);
      } catch (error) {
        console.error("Error obteniendo datos de la cancha:", error);
      }
    };
    const obtenerDeportes = async () => {
      try {
        const deportesSnapshot = await getDocs(collection(db, "deportes"));
        const deportesData = deportesSnapshot.docs.map(
          (doc) => doc.data().nombre
        );
        setDeportesOptions(deportesData);
      } catch (error) {
        console.error("Error obteniendo datos de deportes:", error);
      }
    };

    const obtenerSuelos = async () => {
      try {
        const suelosSnapshot = await getDocs(collection(db, "suelos"));
        const suelosData = suelosSnapshot.docs.map((doc) => doc.data().nombre);
        setSuelosOptions(suelosData);
      } catch (error) {
        console.error("Error obteniendo datos de suelos:", error);
      }
    };

    obtenerDatosCancha();
    obtenerDeportes();
    obtenerSuelos();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
      setAceptaSeña(checked);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleEditarCancha = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const preciosUpdate = doc(db, "canchas", id);

    try {
      await updateDoc(preciosUpdate, formData);

      window.location.href = "/admin";
    } catch (error) {
      console.error("Hubo un error al actualizar la cancha:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    try {
      const storageReference = storageRef(
        storage,
        `canchas/${user.uid}/${file.name}`
      );
      await uploadBytes(storageReference, file);

      const downloadURL = await getDownloadURL(storageReference);
      setImageURL(downloadURL);
      setUrls((prevUrls) => [...prevUrls, downloadURL]);
      const canchaRef = doc(db, "canchas", id);

      await updateDoc(canchaRef, { url: [] });

      const updatedUrls = [downloadURL];

      await updateDoc(canchaRef, { url: updatedUrls });

      setUrls(downloadURL);
      console.log(downloadURL);
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };

  const validateForm = () => {
    const { nombreCancha, codigoArea, numero, precio, deportes, tipoDeCesped } =
      formData;

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

    if (!deportes || deportes.length === 0) {
      setErrorSelectedDeporte("Debes seleccionar al menos un deporte");
      return false;
    } else {
      setErrorSelectedDeporte(null);
    }

    if (validator.isEmpty(precio)) {
      setErrorPrecio("El precio por hora no puede estar vacío");
      return;
    } else {
      setErrorPrecio(null);
    }

    if (!tipoDeCesped) {
      setErrorSelectedSuelo("Debes seleccionar un tipo de suelo");
      return false;
    } else {
      setErrorSelectedSuelo(null);
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

    return true;
  };

  return (
    <>
      <Nav />

      <main>
        <h2 className="text-center fw-bold display-4 mb-4">Editar cancha</h2>
        <div className="text-center"></div>
        <div className="container mx-auto">
          <form
            id="editar-form"
            className="w-50 mx-auto"
            onSubmit={handleEditarCancha}
          >
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label fw-bold fs-5">
                Nombre:
              </label>
              <input
                type="text"
                className="form-control borderRadius"
                id="nombre"
                name="nombreCancha"
                value={formData.nombreCancha}
                onChange={handleChange}
                required
              />
              {errorNombreCancha && (
                <p style={{ color: "red" }}>{errorNombreCancha}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="deportes" className="form-label fw-bold fs-5">
                Deportes:
              </label>
              <select
                name="deportes"
                id="deportes"
                className="form-select borderRadius"
                value={formData.deportes}
                onChange={handleChange}
              >
                {deportesOptions.map((deporte, index) => (
                  <option key={index} value={deporte}>
                    {deporte}
                  </option>
                ))}
              </select>
              {errorSelectedDeporte && (
                <p style={{ color: "red" }}>{errorSelectedDeporte}</p>
              )}
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="aceptaSeña"
                name="aceptaSeña"
                checked={aceptaSeña}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="aceptaSeña">
                ¿Acepta seña?
              </label>
              {aceptaSeña && (
                <>
                  <div className="mb-3">
                    <label htmlFor="cbucvu" className="form-label fw-bold">
                      CBU:
                    </label>
                    <input
                      type="text"
                      className="form-control borderRadius"
                      id="cbucvu"
                      name="cbucvu"
                      value={formData.cbuCvu}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3 form-label fw-bold fs-5">
                    <label htmlFor="alias" className="form-label fw-bold">
                      Alias:
                    </label>
                    <input
                      type="text"
                      className="form-control borderRadius"
                      id="alias"
                      name="alias"
                      value={formData.alias}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
            </div>

            <label
              htmlFor="caracteristicas"
              className="form-label fw-bold fs-5"
            >
              Número:
            </label>
            <div className="mb-3 d-flex">
              <select
                name="codigoArea"
                id="codigoArea"
                className="form-select w-25 borderRadius"
                value={formData.codigoArea}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Selecciona código de área
                </option>
                {listaCodigosArea.map((codigo) => (
                  <option key={codigo.codigo} value={codigo.codigo}>
                    {codigo.codigo} - {codigo.pais}
                  </option>
                ))}
              </select>

              <input
                type="number"
                className="form-control borderRadius"
                id="numero"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                required
              />
              {errorCodigoArea && (
                <p style={{ color: "red" }}>{errorCodigoArea}</p>
              )}
              {errorNumero && <p style={{ color: "red" }}>{errorNumero}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="banos" className="form-label fw-bold fs-5">
                Baños y vestuarios:
              </label>
              <select
                name="banosVestuarios"
                id="banos"
                className="form-select borderRadius"
                value={formData.banosVestuarios}
                onChange={handleChange}
              >
                <option value="Si">Si</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="precio" className="form-label fw-bold fs-5">
                Precio por hora:
              </label>
              <input
                type="number"
                className="form-control borderRadius"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                required
              />
              {errorPrecio && <p style={{ color: "red" }}>{errorPrecio}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="tipoDeCesped" className="form-label fw-bold fs-5">
                Tipo de suelo:
              </label>
              <select
                name="tipoDeCesped"
                id="tipoDeCesped"
                className="form-select borderRadius"
                value={formData.tipoDeCesped}
                onChange={handleChange}
              >
                {suelosOptions.map((suelo, index) => (
                  <option key={index} value={suelo}>
                    {suelo}
                  </option>
                ))}
              </select>
              {errorSelectedSuelo && (
                <p style={{ color: "red" }}>{errorSelectedSuelo}</p>
              )}
            </div>
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
            <button type="submit" className=" mb-3 lobby-button fs-6 ">
              Guardar
            </button>
          </form>
          <div className="textoEditar"></div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default EditarCancha;
