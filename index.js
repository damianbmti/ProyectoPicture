import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import rutas from "./routes/rutas.js";
import conectarBD from "./BD/bd.js"
import { crearUsuario, verificarUsuario, obtenerUsuarioPorId, actualizarUsuario, borrarUsuario } from "./BD/usuarioBD.js";
import { isLoggedIn } from "./middleware/auth.js";
import multer from 'multer';
import path from 'path';

dotenv.config();
const app = express();


async function conexion(){
  await conectarBD();
}
conexion();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(session({
  secret: process.env.SECRET_SESSION || "bibliojuegos-dev-secret",
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));


app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.rol = req.session.rol || null;
  res.locals.userId = req.session.userId || null;
  res.locals.foto = req.session.foto || null;
  next();
});


app.get("/login", (req, res) => {
  res.render("login.ejs", { titulo: "Iniciar Sesión" });
});

app.get("/registro", (req, res) => {
  res.render("registro.ejs", { titulo: "Crear Cuenta" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const usuarioEncontrado = await verificarUsuario(email, password);

    if (usuarioEncontrado) {
      
      req.session.user = usuarioEncontrado.email;
      req.session.rol = usuarioEncontrado.rol;
      req.session.userId = usuarioEncontrado._id;
      req.session.foto = usuarioEncontrado.foto || null;
      res.redirect("/mostrarJuegos");
    } else {
      
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/login");
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'public', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.post("/registro", upload.single('foto'), async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  
  if (password !== confirmPassword) {
    return res.redirect("/registro");
  }
  
  try {
    const fotoFilename = req.file ? req.file.filename : null;
    const nuevoUsuario = await crearUsuario(email, password, 'normal', fotoFilename);

    req.session.user = nuevoUsuario.email;
    req.session.rol = nuevoUsuario.rol;
    req.session.userId = nuevoUsuario._id;
    req.session.foto = nuevoUsuario.foto || null;
    res.redirect("/mostrarJuegos");

  } catch (error) {
    console.log(error);
    res.redirect("/registro");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
});

app.use("/", rutas);


const PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
  console.log("Aplicación de BiblioJuegos en http://localhost:" + PORT);
});

app.get('/perfil', isLoggedIn, async (req, res) => {
  try {
    const usuario = await obtenerUsuarioPorId(req.session.userId);
    res.render('perfil', { usuario });
  } catch (error) {
    console.error('Error al mostrar perfil:', error.message);
    res.redirect('/');
  }
});

app.get('/perfil/editar', isLoggedIn, async (req, res) => {
  try {
    const usuario = await obtenerUsuarioPorId(req.session.userId);
    res.render('editarPerfil', { usuario });
  } catch (error) {
    console.error('Error al abrir edición de perfil:', error.message);
    res.redirect('/perfil');
  }
});

app.post('/perfil/editar', isLoggedIn, upload.single('foto'), async (req, res) => {
  try {
    const updates = {};
    if (req.body.email) updates.email = req.body.email;
    if (req.body.password) updates.password = req.body.password;
    if (req.file && req.file.filename) updates.foto = req.file.filename;
    if (req.body && req.body.borrarFoto === 'on') updates.borrarFoto = true;

    const usuarioActualizado = await actualizarUsuario(req.session.userId, updates);
    req.session.user = usuarioActualizado.email;
    req.session.foto = usuarioActualizado.foto || null;

    res.redirect('/perfil');
  } catch (error) {
    console.error('Error actualizando perfil:', error.message);
    res.redirect('/perfil/editar');
  }
});

app.post('/perfil/borrar', isLoggedIn, async (req, res) => {
  try {
    await borrarUsuario(req.session.userId);
    req.session.destroy(err => {
      if (err) console.error(err);
      res.redirect('/');
    });
  } catch (error) {
    console.error('Error borrando cuenta:', error.message);
    res.redirect('/perfil');
  }
});