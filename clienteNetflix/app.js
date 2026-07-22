// ===== ELEMENTOS =====
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

const formPeliculasWrapper = document.getElementById("form-peliculas");
const formSeriesWrapper = document.getElementById("form-series");

const formularioPeliculas = document.getElementById("formularioPeliculas");
const formularioSeries = document.getElementById("formularioSeries");

const listaPeliculas = document.getElementById("listaPeliculas");
const listaSeries = document.getElementById("listaSeries");

// ===== CAMBIO DE PESTAÑA =====
tabBtns.forEach((btn) => {

    btn.addEventListener("click", async () => {

        tabBtns.forEach((b) => b.classList.remove("active"));
        tabContents.forEach((c) => c.classList.remove("active"));

        btn.classList.add("active");
        document.getElementById("tab-" + btn.dataset.tab).classList.add("active");

        if (btn.dataset.tab === "peliculas") {
            formPeliculasWrapper.style.display = "block";
            formSeriesWrapper.style.display = "none";
            await cargarPeliculas();
        }

        if (btn.dataset.tab === "series") {
            formPeliculasWrapper.style.display = "none";
            formSeriesWrapper.style.display = "block";
            await cargarSeries();
        }

    });

});

// ===================== PELÍCULAS =====================

formularioPeliculas.addEventListener("submit", async (e) => {

    e.preventDefault();

    const id = document.getElementById("peliculaId").value;

    const pelicula = {
        titulo: document.getElementById("tituloPelicula").value,
        genero: document.getElementById("generoPelicula").value,
        año: Number(document.getElementById("añoPelicula").value),
        duracion: Number(document.getElementById("duracionPelicula").value),
        idioma: document.getElementById("idiomaPelicula").value,
        calificacion: Number(document.getElementById("calificacionPelicula").value),
        
    };

    try {

        if (id) {
            const respuesta = await actualizarPelicula(id, pelicula);
            alert(respuesta.mensaje);
        } else {
            const respuesta = await agregarPelicula(pelicula);
            alert(respuesta.mensaje);
        }

        cancelarEdicionPelicula();
        await cargarPeliculas();

    } catch (error) {
        alert(error.message);
    }

});

document.getElementById("btnCancelarPelicula").addEventListener("click", cancelarEdicionPelicula);

function cancelarEdicionPelicula() {
    formularioPeliculas.reset();
    document.getElementById("peliculaId").value = "";
    document.getElementById("tituloFormPeliculas").textContent = "Registrar película";
    document.getElementById("btnGuardarPelicula").innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar película';
    document.getElementById("btnCancelarPelicula").style.display = "none";
}

async function cargarPeliculas() {

    try {

        const peliculas = await obtenerPeliculas();

        listaPeliculas.innerHTML = "";

        peliculas.forEach((pelicula) => {

            const card = document.createElement("div");
            card.classList.add("movie-card");

            const posterUrl = pelicula.poster && pelicula.poster.trim() !== ""
                ? pelicula.poster
                : "https://placehold.co/300x450/1f1f1f/e50914?text=" + encodeURIComponent(pelicula.titulo);

            card.style.backgroundImage = `url('${posterUrl}')`;

            card.innerHTML = `
                <div class="card-rating"><i class="fa-solid fa-star"></i> ${pelicula.calificacion}</div>
                <div class="card-overlay">
                    <h3 class="card-title">${pelicula.titulo}</h3>
                    <p class="card-meta">${pelicula.genero} · ${pelicula.año}</p>
                    <div class="card-buttons">
                        <button class="btn-editar" data-id="${pelicula._id}"><i class="fa-solid fa-pen"></i> Editar</button>
                        <button class="btn-eliminar" data-id="${pelicula._id}"><i class="fa-solid fa-trash"></i> Eliminar</button>
                    </div>
                </div>
            `;

            listaPeliculas.appendChild(card);

        });

        document.querySelectorAll("#listaPeliculas .btn-editar").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const pelicula = peliculas.find(p => p._id === btn.dataset.id);
                editarPelicula(pelicula);
            });
        });

        document.querySelectorAll("#listaPeliculas .btn-eliminar").forEach((btn) => {
            btn.addEventListener("click", async () => {
                if (confirm("¿Seguro que quieres eliminar esta película?")) {
                    try {
                        await eliminarPelicula(btn.dataset.id);
                        await cargarPeliculas();
                    } catch (error) {
                        alert(error.message);
                    }
                }
            });
        });

    } catch (error) {
        alert(error.message);
    }

}

function editarPelicula(pelicula) {
    document.getElementById("peliculaId").value = pelicula._id;
    document.getElementById("tituloPelicula").value = pelicula.titulo;
    document.getElementById("generoPelicula").value = pelicula.genero;
    document.getElementById("añoPelicula").value = pelicula.año;
    document.getElementById("duracionPelicula").value = pelicula.duracion;
    document.getElementById("idiomaPelicula").value = pelicula.idioma;
    document.getElementById("calificacionPelicula").value = pelicula.calificacion;
   

    document.getElementById("tituloFormPeliculas").textContent = "Editar película";
    document.getElementById("btnGuardarPelicula").innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Actualizar película';
    document.getElementById("btnCancelarPelicula").style.display = "inline-block";

    formPeliculasWrapper.scrollIntoView({ behavior: "smooth" });
}

// ===================== SERIES =====================

formularioSeries.addEventListener("submit", async (e) => {

    e.preventDefault();

    const id = document.getElementById("serieId").value;

    const serie = {
        titulo: document.getElementById("tituloSerie").value,
        genero: document.getElementById("generoSerie").value,
        año: Number(document.getElementById("añoSerie").value),
        temporadas: Number(document.getElementById("temporadasSerie").value),
        episodios: Number(document.getElementById("episodiosSerie").value),
        idioma: document.getElementById("idiomaSerie").value,
        calificacion: Number(document.getElementById("calificacionSerie").value),
        
    };

    try {

        if (id) {
            const respuesta = await actualizarSerie(id, serie);
            alert(respuesta.mensaje);
        } else {
            const respuesta = await agregarSerie(serie);
            alert(respuesta.mensaje);
        }

        cancelarEdicionSerie();
        await cargarSeries();

    } catch (error) {
        alert(error.message);
    }

});

document.getElementById("btnCancelarSerie").addEventListener("click", cancelarEdicionSerie);

function cancelarEdicionSerie() {
    formularioSeries.reset();
    document.getElementById("serieId").value = "";
    document.getElementById("tituloFormSeries").textContent = "Registrar serie";
    document.getElementById("btnGuardarSerie").innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar serie';
    document.getElementById("btnCancelarSerie").style.display = "none";
}

async function cargarSeries() {

    try {

        const series = await obtenerSeries();

        listaSeries.innerHTML = "";

        series.forEach((serie) => {

            const card = document.createElement("div");
            card.classList.add("movie-card");

            const posterUrl = serie.poster && serie.poster.trim() !== ""
                ? serie.poster
                : "https://placehold.co/300x450/1f1f1f/e50914?text=" + encodeURIComponent(serie.titulo);

            card.style.backgroundImage = `url('${posterUrl}')`;

            card.innerHTML = `
                <div class="card-rating"><i class="fa-solid fa-star"></i> ${serie.calificacion}</div>
                <div class="card-overlay">
                    <h3 class="card-title">${serie.titulo}</h3>
                    <p class="card-meta">${serie.genero} · ${serie.año}</p>
                    <div class="card-buttons">
                        <button class="btn-editar" data-id="${serie._id}"><i class="fa-solid fa-pen"></i> Editar</button>
                        <button class="btn-eliminar" data-id="${serie._id}"><i class="fa-solid fa-trash"></i> Eliminar</button>
                    </div>
                </div>
            `;

            listaSeries.appendChild(card);

        });

        document.querySelectorAll("#listaSeries .btn-editar").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const serie = series.find(s => s._id === btn.dataset.id);
                editarSerie(serie);
            });
        });

        document.querySelectorAll("#listaSeries .btn-eliminar").forEach((btn) => {
            btn.addEventListener("click", async () => {
                if (confirm("¿Seguro que quieres eliminar esta serie?")) {
                    try {
                        await eliminarSerie(btn.dataset.id);
                        await cargarSeries();
                    } catch (error) {
                        alert(error.message);
                    }
                }
            });
        });

    } catch (error) {
        listaSeries.innerHTML = `<p class="empty-msg">No se pudieron cargar las series 😕</p>`;
    }

}

function editarSerie(serie) {
    document.getElementById("serieId").value = serie._id;
    document.getElementById("tituloSerie").value = serie.titulo;
    document.getElementById("generoSerie").value = serie.genero;
    document.getElementById("añoSerie").value = serie.año;
    document.getElementById("temporadasSerie").value = serie.temporadas;
    document.getElementById("episodiosSerie").value = serie.episodios;
    document.getElementById("idiomaSerie").value = serie.idioma;
    document.getElementById("calificacionSerie").value = serie.calificacion;
    

    document.getElementById("tituloFormSeries").textContent = "Editar serie";
    document.getElementById("btnGuardarSerie").innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Actualizar serie';
    document.getElementById("btnCancelarSerie").style.display = "inline-block";

    formSeriesWrapper.scrollIntoView({ behavior: "smooth" });
}

// ===== CARGA INICIAL =====
cargarPeliculas();