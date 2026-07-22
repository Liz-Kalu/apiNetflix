const API_URL = "https://api-netflix-alpha.vercel.app";

// ===== PELÍCULAS =====

async function obtenerPeliculas() {
    const respuesta = await fetch(`${API_URL}/peliculas`);
    if (!respuesta.ok) throw new Error("Error al consultar las películas");
    return await respuesta.json();
}

async function agregarPelicula(pelicula) {
    const respuesta = await fetch(`${API_URL}/peliculas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pelicula)
    });
    if (!respuesta.ok) throw new Error("Error al guardar la película");
    return await respuesta.json();
}

async function actualizarPelicula(id, pelicula) {
    const respuesta = await fetch(`${API_URL}/peliculas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pelicula)
    });
    if (!respuesta.ok) throw new Error("Error al actualizar la película");
    return await respuesta.json();
}

async function eliminarPelicula(id) {
    const respuesta = await fetch(`${API_URL}/peliculas/${id}`, {
        method: "DELETE"
    });
    if (!respuesta.ok) throw new Error("Error al eliminar la película");
    return await respuesta.json();
}

// ===== SERIES =====

async function obtenerSeries() {
    const respuesta = await fetch(`${API_URL}/series`);
    if (!respuesta.ok) throw new Error("Error al consultar las series");
    return await respuesta.json();
}

async function agregarSerie(serie) {
    const respuesta = await fetch(`${API_URL}/series`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serie)
    });
    if (!respuesta.ok) throw new Error("Error al guardar la serie");
    return await respuesta.json();
}

async function actualizarSerie(id, serie) {
    const respuesta = await fetch(`${API_URL}/series/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serie)
    });
    if (!respuesta.ok) throw new Error("Error al actualizar la serie");
    return await respuesta.json();
}

async function eliminarSerie(id) {
    const respuesta = await fetch(`${API_URL}/series/${id}`, {
        method: "DELETE"
    });
    if (!respuesta.ok) throw new Error("Error al eliminar la serie");
    return await respuesta.json();
}