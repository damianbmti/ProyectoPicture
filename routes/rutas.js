import { Router } from "express";

import { isLoggedIn, isAdministrador } from "../middleware/auth.js";
import {
  nuevoJuego, 
  mostrarJuegos, 
  buscarJuegoPorId, 
  editarJuego, 
  borrarJuego, 
  buscarJuego,
  nuevaPlataforma,   
  mostrarPlataformas  
} from "../BD/juegoBD.js"; 
const router = Router();

// RUTAS PÚBLICAS
router.get("/", function (req, res){
  res.render("home", { titulo: "Bienvenido" });
});

// --- RUTAS DE USUARIO NORMAL (y Admin) ---
router.get("/agregarJuego", isLoggedIn, async (req, res) => {
  const plataformasBD = await mostrarPlataformas();
  res.render("agregarJuego", { plataformasBD });
});

router.post("/agregarJuego", isLoggedIn, async function(req, res){
  console.log("Datos recibidos:", req.body);
  const respuestaMongo = await nuevoJuego(req.body);
  console.log(respuestaMongo);
  res.redirect("/mostrarJuegos");
})

router.get("/mostrarJuegos", isLoggedIn, async function(req,res){
  const juegosBD = await mostrarJuegos();
  res.render("mostrarJuegos", {juegosBD});
})

router.get("/editar/:id", isLoggedIn, async function(req,res){
  const id = req.params.id;
  const juegoBD = await buscarJuegoPorId(id);
  const plataformasBD = await mostrarPlataformas(); 
  res.render("editarJuego",{juegoBD, plataformasBD}); 
})

router.post("/editarJuego", isLoggedIn, async function(req,res){
  const respuestaMongo = await editarJuego(req.body);
  console.log(respuestaMongo);
  res.redirect("/mostrarJuegos");
})

router.get("/borrar/:id", isLoggedIn, async function(req, res){
  const id = req.params.id;
  const respuestaMongo = await borrarJuego(id);
  res.redirect("/mostrarJuegos");
})

router.post("/buscarJuego", isLoggedIn, async function(req,res){
  const titulo = req.body.titulo; 
  const juegosBD = await buscarJuego(titulo);
  res.render("mostrarJuegos", {juegosBD: juegosBD}); 
})


// RUTAS DE SÓLO ADMINISTRADOR 
router.get("/plataformas", isLoggedIn, isAdministrador, async (req, res) => {
  const plataformasBD = await mostrarPlataformas();
  res.render("plataformas", { plataformasBD });
});

router.post("/plataformas", isLoggedIn, isAdministrador, async (req, res) => {
  await nuevaPlataforma(req.body);
  res.redirect("/plataformas");
});


export default router;