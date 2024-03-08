import { db, doc, getDoc } from "../firebase"; // Ajusta la importación según tu estructura

const obtenerRolDeUsuario = async (uid) => {
  try {
    const docRef = doc(db, "usuarios", uid);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      const userRole = userData.rol;
      return userRole;
    } else {
      console.log("Usuario no encontrado");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el rol del usuario:", error);
    return null;
  }
};

export default obtenerRolDeUsuario;
