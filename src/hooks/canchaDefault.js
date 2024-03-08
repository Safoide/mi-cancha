import { db, doc, setDoc } from "../firebase";

function enviarCanchaDefault() {
  const buscarCoordenadas = () => {
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: "Obelisco" }, async (results, status) => {
      if (status === "OK") {
        const latitud = results[0].geometry.location.lat();
        const longitud = results[0].geometry.location.lng();
        let docRef = await setDoc(
          doc(db, "direcciones", "XwmXN9UikzcUdH4OLmMV"),
          {
            estado: "Aceptada",
            lat: latitud,
            lng: longitud,
          }
        );
        return { latitud, longitud };
      } else {
        console.log("No se encontraron coordenadas para esta dirección.");
      }
    });
  };

  const CanchaDefault = setDoc(doc(db, "canchas", "XwmXN9UikzcUdH4OLmMV"), {
    nombreCancha: "Nacho",
    ubicacion: "Obelisco",
    deportes: "Futbol",
    luminosidad: "Si",
    banosVestuarios: true,
    precio: "250",
    nombreCompleto: "Nacho relae",
    tipoDeCesped: "Pasto",
    email: "nacho@gmail.com",
    DNI: "43990888",
    codigoArea: "54",
    numero: "1125001502",
    estado: "Aceptada",
    events: [
      {
        title: "Evento Simulado",
        start: "2024-02-18T12:00:00-03:00",
        end: "2024-02-18T12:00:00-03:00",
      },
    ],
    horarios: [
      { hora: "9:00 AM", disponibilidad: true },
      { hora: "10:00 AM", disponibilidad: true },
      { hora: "11:00 AM", disponibilidad: true },
      { hora: "12:00 PM", disponibilidad: true },
      { hora: "1:00 PM", disponibilidad: true },
      { hora: "2:00 PM", disponibilidad: true },
      { hora: "3:00 PM", disponibilidad: true },
      { hora: "4:00 PM", disponibilidad: true },
      { hora: "5:00 PM", disponibilidad: true },
      { hora: "6:00 PM", disponibilidad: true },
      { hora: "7:00 PM", disponibilidad: true },
      { hora: "8:00 PM", disponibilidad: true },
      { hora: "9:00 PM", disponibilidad: true },
      { hora: "10:00 PM", disponibilidad: true },
      { hora: "11:00 PM", disponibilidad: true },
      // ... otros horarios
    ],
  });
  buscarCoordenadas();
}

export default enviarCanchaDefault;
