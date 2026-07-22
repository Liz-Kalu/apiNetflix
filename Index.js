const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const PORT = 3000;

const MONGO_URI = "mongodb+srv://grupo:grupo@servidorprueba.ygegryf.mongodb.net/netflix";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Conectado correctamente a MongoDB Atlas (netflix)");
  })
  .catch((error) => {
    console.error("Error al conectar con MongoDB:", error);
  });

const seriesSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    genero: { type: String, required: true, trim: true },
    año: { type: Number, required: true },
    temporadas: { type: Number, required: true, min: 1 },
    episodios: { type: Number, required: true, min: 1 },
    idioma: { type: String, required: true, trim: true },
    calificacion: { type: Number, required: true, min: 0, max: 10 },
    nc: { type: String, required: false, trim: true }
  },
  { timestamps: true }
);

const peliculasSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    genero: { type: String, required: true, trim: true },
    año: { type: Number, required: true },
    duracion: { type: Number, required: true, min: 1 },
    idioma: { type: String, required: true, trim: true },
    calificacion: { type: Number, required: true, min: 0, max: 10 },
    nc: { type: String, required: false, trim: true }
  },
  { timestamps: true }
);

const Serie = mongoose.model("Serie", seriesSchema, "series");
const Pelicula = mongoose.model("Pelicula", peliculasSchema, "peliculas");

app.get("/series", async (req, res) => {
  try {
    const series = await Serie.find();
    res.json(series);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener las series", error: error });
  }
});

app.get("/series/:id", async (req, res) => {
  try {
    const serie = await Serie.findById(req.params.id);
    if (!serie) return res.status(404).json({ mensaje: "Serie no encontrada" });
    res.json(serie);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener la serie", error: error });
  }
});

app.post("/series", async (req, res) => {
  try {
    const { titulo, genero, año, temporadas, episodios, idioma, calificacion, nc } = req.body;

    if (!titulo || !genero || !año || !temporadas || !episodios || !idioma || calificacion === undefined) {
      return res.status(400).json({ mensaje: "Faltan datos de la serie" });
    }

    const nuevaSerie = new Serie({ titulo, genero, año, temporadas, episodios, idioma, calificacion, nc });
    const serieGuardada = await nuevaSerie.save();

    res.json({ mensaje: "Serie registrada correctamente", serie: serieGuardada });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al guardar la serie", error: error });
  }
});

app.put("/series/:id", async (req, res) => {
  try {
    const { titulo, genero, año, temporadas, episodios, idioma, calificacion, nc } = req.body;

    if (!titulo || !genero || !año || !temporadas || !episodios || !idioma || calificacion === undefined) {
      return res.status(400).json({ mensaje: "Faltan datos de la serie" });
    }

    const serieActualizada = await Serie.findByIdAndUpdate(
      req.params.id,
      { titulo, genero, año, temporadas, episodios, idioma, calificacion, nc },
      { new: true, runValidators: true }
    );

    if (!serieActualizada) return res.status(404).json({ mensaje: "Serie no encontrada" });

    res.json({ mensaje: "Serie actualizada correctamente", serie: serieActualizada });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar la serie", error: error });
  }
});

app.delete("/series/:id", async (req, res) => {
  try {
    const serieEliminada = await Serie.findByIdAndDelete(req.params.id);
    if (!serieEliminada) return res.status(404).json({ mensaje: "Serie no encontrada" });
    res.json({ mensaje: "Serie eliminada correctamente", serie: serieEliminada });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar la serie", error: error });
  }
});

app.get("/peliculas", async (req, res) => {
  try {
    const peliculas = await Pelicula.find();
    res.json(peliculas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener las peliculas", error: error });
  }
});

app.get("/peliculas/:id", async (req, res) => {
  try {
    const pelicula = await Pelicula.findById(req.params.id);
    if (!pelicula) return res.status(404).json({ mensaje: "Pelicula no encontrada" });
    res.json(pelicula);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener la pelicula", error: error });
  }
});

app.post("/peliculas", async (req, res) => {
  try {
    const { titulo, genero, año, duracion, idioma, calificacion, nc } = req.body;

    if (!titulo || !genero || !año || !duracion || !idioma || calificacion === undefined) {
      return res.status(400).json({ mensaje: "Faltan datos de la pelicula" });
    }

    const nuevaPelicula = new Pelicula({ titulo, genero, año, duracion, idioma, calificacion, nc });
    const peliculaGuardada = await nuevaPelicula.save();

    res.json({ mensaje: "Pelicula registrada correctamente", pelicula: peliculaGuardada });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al guardar la pelicula", error: error });
  }
});

app.put("/peliculas/:id", async (req, res) => {
  try {
    const { titulo, genero, año, duracion, idioma, calificacion, nc } = req.body;

    if (!titulo || !genero || !año || !duracion || !idioma || calificacion === undefined) {
      return res.status(400).json({ mensaje: "Faltan datos de la pelicula" });
    }

    const peliculaActualizada = await Pelicula.findByIdAndUpdate(
      req.params.id,
      { titulo, genero, año, duracion, idioma, calificacion, nc },
      { new: true, runValidators: true }
    );

    if (!peliculaActualizada) return res.status(404).json({ mensaje: "Pelicula no encontrada" });

    res.json({ mensaje: "Pelicula actualizada correctamente", pelicula: peliculaActualizada });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar la pelicula", error: error });
  }
});

app.delete("/peliculas/:id", async (req, res) => {
  try {
    const peliculaEliminada = await Pelicula.findByIdAndDelete(req.params.id);
    if (!peliculaEliminada) return res.status(404).json({ mensaje: "Pelicula no encontrada" });
    res.json({ mensaje: "Pelicula eliminada correctamente", pelicula: peliculaEliminada });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar la pelicula", error: error });
  }
});

app.get("/", (req, res) => {
  res.send("API de Netflix (series y peliculas) funcionando");
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log("Servidor iniciado en http://localhost:" + PORT);
  });
}

module.exports = app;