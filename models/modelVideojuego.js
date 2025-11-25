import mongoose from "mongoose";

const videojuegoSchema = new mongoose.Schema({
	titulo: {
		type: String,
		required: true,
		trim: true,
		unique: false
	},
	ano: {
		type: Number,
		required: true, 
		trim: true,
		unique: false
	},
	genero: { // Campo nuevo
		type: String,
		required: false,
		trim: true,
		unique: false
	},
	
	plataforma: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Plataforma", 
		required: true
	}
});

export default mongoose.model("Videojuego", videojuegoSchema);