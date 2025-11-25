import mongoose from "mongoose";

const plataformaSchema = new mongoose.Schema({
	nombre: {
		type: String,
		required: true,
		trim: true,
		unique: true
	}
});

export default mongoose.model("Plataforma", plataformaSchema);