import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, 
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    required: true,
    enum: ['normal', 'administrador'],
    default: 'normal'
  }
  ,
  foto: {
    type: String,
    default: null
  }
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;