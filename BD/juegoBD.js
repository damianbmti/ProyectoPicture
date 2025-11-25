import Videojuego from "../models/modelVideojuego.js";
import Plataforma from "../models/modelPlataforma.js"; 

export async function nuevoJuego({titulo, ano, genero, plataforma}) {
  const videojuego = new Videojuego({ titulo, ano, genero, plataforma });
  console.log("------------");
  console.log(videojuego); 
  console.log("------------");

  try {
    const respuestaMongo = await videojuego.save();
    return respuestaMongo;
  } catch (error) {
    console.error("❌ Error al guardar videojuego:", error);
    throw error;
  }
}


export async function mostrarJuegos(){
  const juegosBD = await Videojuego.find().populate('plataforma');
  return juegosBD;
}

export async function buscarJuegoPorId(id){
  const juegoBD = await Videojuego.findById(id).populate('plataforma');
  return juegoBD;
}

export async function editarJuego({id, titulo, ano, genero, plataforma}){
  const respuestaMongo = await Videojuego.findByIdAndUpdate(id,{titulo, ano, genero, plataforma});
  return respuestaMongo;
}

export async function borrarJuego(id){
  const respuestaMongo = await Videojuego.findByIdAndDelete(id);
  return respuestaMongo;
}

export async function buscarJuego(titulo){
  // Buscamos por 'titulo' en lugar de 'nombre' y usamos RegExp para búsqueda parcial
  const juegosBD = await Videojuego.find({ titulo: new RegExp(titulo, 'i') }).populate('plataforma');
  return juegosBD;
}


export async function nuevaPlataforma({nombre}) {
  const plataforma = new Plataforma({ nombre });
  try {
    const respuestaMongo = await plataforma.save();
    return respuestaMongo;
  } catch (error) {
    console.error("❌ Error al guardar plataforma:", error);
    throw error;
  }
}

export async function mostrarPlataformas(){
  const plataformasBD = await Plataforma.find();
  return plataformasBD;
}