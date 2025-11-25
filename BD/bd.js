import mongoose from "mongoose";

async function conectarBD() {
  try {
    // Lee la variable de conexión de forma segura desde .env
    const uri = process.env.MONGO_URI;

    // Comprueba que la variable existra
    if (!uri) {
      throw new Error("No se encontró la variable MONGO_URI en el archivo .env");
    }

    // 3. se conecta usando la variable
    const conexion = await mongoose.connect(uri);
    console.log("✅ Conexión establecida con Mongo Atlas");

  } catch (err) {
    console.log("❌ Error de conexión: " + err.message);
  }
}

export default conectarBD;