function ocultarPaginaPrincipal() {
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.ayuda').style.display = 'none';
    document.querySelector('.categorias').style.display = 'none';
    document.querySelector('.turismo').style.display = 'none';
    document.querySelector('.contacto').style.display = 'none';
}

function mostrarPaginaPrincipal() {
    document.querySelector('.hero').style.display = 'flex';
    document.querySelector('.ayuda').style.display = 'block';
    document.querySelector('.categorias').style.display = 'block';
    document.querySelector('.turismo').style.display = 'block';
    document.querySelector('.contacto').style.display = 'block';
}

function ocultarSeccionesInternas() {
    document.querySelector('#seccionMujeres').style.display = 'none';
    document.querySelector('#seccionNinez').style.display = 'none';
    document.querySelector('#seccionMayores').style.display = 'none';
    document.querySelector('#seccionComunidad').style.display = 'none';
    document.querySelector('#seccionDiscapacidad').style.display = 'none';
    document.querySelector('#seccionSalud').style.display = 'none';
    document.querySelector('#seccionTrabajo').style.display = 'none';
    document.querySelector('#seccionDeportes').style.display = 'none';
    document.querySelector('#seccionCultura').style.display = 'none';
    document.querySelector('#seccionEducacion').style.display = 'none';
}

function mostrarMujeres() {
    ocultarPaginaPrincipal();
    ocultarSeccionesInternas();

    document.querySelector('#seccionMujeres').style.display = 'block';
    window.scrollTo(0, 0);
}

function mostrarNinez() {
    ocultarPaginaPrincipal();
    ocultarSeccionesInternas();

    document.querySelector('#seccionNinez').style.display = 'block';
    window.scrollTo(0, 0);
}

function mostrarMayores() {
    ocultarPaginaPrincipal();
    ocultarSeccionesInternas();

    document.querySelector('#seccionMayores').style.display = 'block';
    window.scrollTo(0, 0);
}

function volverCategorias() {
    ocultarSeccionesInternas();
    mostrarPaginaPrincipal();

    window.scrollTo(0, 0);
}

function mostrarComunidad() {
    ocultarPaginaPrincipal();
    ocultarSeccionesInternas();

    document.querySelector('#seccionComunidad').style.display = 'block';

    window.scrollTo(0, 0);
}

function mostrarDiscapacidad() {
    ocultarPaginaPrincipal();
    ocultarSeccionesInternas();

    document.querySelector('#seccionDiscapacidad').style.display = 'block';

    window.scrollTo(0, 0);
}

function mostrarSalud() {
    ocultarPaginaPrincipal();
    ocultarSeccionesInternas();

    document.querySelector('#seccionSalud').style.display = 'block';

    window.scrollTo(0, 0);
}

function mostrarTrabajo() {
    ocultarPaginaPrincipal();
    ocultarSeccionesInternas();

    document.querySelector('#seccionTrabajo').style.display = 'block';

    window.scrollTo(0, 0);
}

function mostrarDeportes() {
    ocultarPaginaPrincipal();
    ocultarSeccionesInternas();

    document.querySelector('#seccionDeportes').style.display = 'block';

    window.scrollTo(0, 0);
}

function mostrarCultura() {
    ocultarPaginaPrincipal();
    ocultarSeccionesInternas();

    document.querySelector('#seccionCultura').style.display = 'block';

    window.scrollTo(0, 0);
}

function mostrarEducacion() {
    ocultarPaginaPrincipal();
    ocultarSeccionesInternas();

    document.querySelector('#seccionEducacion').style.display = 'block';

    window.scrollTo(0, 0);
}

function abrirAyuda(){
    document.getElementById("overlayAyuda").classList.add("activo");
}

function cerrarAyuda(){
    document.getElementById("overlayAyuda").classList.remove("activo");
}
