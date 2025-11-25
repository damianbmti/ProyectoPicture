import Usuario from "../models/modelUsuario.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

export const crearUsuario = async (email, password, rol, foto = null) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHasheado = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({
      email: email,
      password: passwordHasheado,
      rol: rol || "normal",
      foto: foto || null,
    });

    await nuevoUsuario.save();
    return nuevoUsuario;
  } catch (error) {
    console.error("Error al crear el usuario:", error.message);
    if (error.code === 11000) {
      throw new Error("El correo electrónico ya está registrado.");
    }
    throw error;
  }
};

export const verificarUsuario = async (email, password) => {
  try {
    const usuario = await Usuario.findOne({ email: email });
    if (!usuario) {
      
      return null;
    }

    const esPasswordCorrecto = await bcrypt.compare(password, usuario.password);

    if (esPasswordCorrecto) {
      return {
        email: usuario.email,
        rol: usuario.rol,
        _id: usuario._id,
        foto: usuario.foto || null,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al verificar el usuario:", error.message);
    throw error;
  }
};

export const obtenerUsuarioPorId = async (id) => {
  try {
    return await Usuario.findById(id).lean();
  } catch (error) {
    console.error("Error al obtener usuario por id:", error.message);
    throw error;
  }
};

export const actualizarUsuario = async (id, updates) => {
  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) throw new Error("Usuario no encontrado");

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      usuario.password = await bcrypt.hash(updates.password, salt);
    }

    if (updates.borrarFoto) {
      if (usuario.foto) {
        const rutaAntigua = path.join(
          process.cwd(),
          "public",
          "uploads",
          usuario.foto
        );
        if (fs.existsSync(rutaAntigua)) fs.unlinkSync(rutaAntigua);
      }
      usuario.foto = null;
    }

    if (updates.foto) {
      if (usuario.foto) {
        const rutaAntigua = path.join(
          process.cwd(),
          "public",
          "uploads",
          usuario.foto
        );
        if (fs.existsSync(rutaAntigua)) fs.unlinkSync(rutaAntigua);
      }
      usuario.foto = updates.foto;
    }

    if (updates.email) usuario.email = updates.email;
    if (updates.rol) usuario.rol = updates.rol;

    await usuario.save();
    return usuario;
  } catch (error) {
    console.error("Error actualizando usuario:", error.message);
    throw error;
  }
};

export const borrarUsuario = async (id) => {
  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) return null;

    if (usuario.foto) {
      const ruta = path.join(process.cwd(), "public", "uploads", usuario.foto);
      if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
    }

    const res = await Usuario.deleteOne({ _id: id });
    return res;
  } catch (error) {
    console.error("Error borrando usuario:", error.message);
    throw error;
  }
};
