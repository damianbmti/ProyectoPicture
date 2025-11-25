// a) Que no cualquier usuario puede entrar
export const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    // d) Si no hay sesión, no puede entrar a ninguna ruta protegida
    return res.redirect("/login");
  }
  next();
};

// b) y c) Que el usuario normal no puede entrar a rutas admin
export const isAdministrador = (req, res, next) => {
  if (req.session.rol !== "administrador") {
    // Si no es admin, lo mandamos al inicio (no tiene permisos)
    return res.redirect("/"); 
  }
  next();
};