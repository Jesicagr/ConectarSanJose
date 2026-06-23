window.ConectarSJ = window.ConectarSJ || {};

(function (ns) {
  var API = 'http://localhost:8080/api';

  function get(url, cb) {
    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (d) { cb(null, d); })
      .catch(function (e) { cb(e, null); });
  }

  function post(url, body) {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).catch(function () {});
  }

  /* ─────── TRACKING ─────── */

  ns.trackPagina = function (nombre) {
    post(API + '/visitas', { pagina: nombre });
  };

  ns.trackActividad = function (id) {
    post(API + '/visitas', { pagina: 'actividad-' + id });
  };

  ns.trackSede = function (id) {
    post(API + '/visitas', { pagina: 'sede-' + id });
  };

  ns.trackArea = function (id) {
    post(API + '/visitas', { pagina: 'area-' + id });
  };

  ns.trackContacto = function (id) {
    post(API + '/visitas', { pagina: 'contacto-' + id });
  };

  /* ─────── DATOS PÚBLICOS ─────── */

  ns.obtenerActividades = function (cb) {
    get(API + '/actividades', cb);
  };

  ns.obtenerActividad = function (id, cb) {
    get(API + '/actividades/' + id, cb);
  };

  ns.obtenerSedes = function (cb) {
    get(API + '/sedes', cb);
  };

  ns.obtenerSede = function (id, cb) {
    get(API + '/sedes/' + id, cb);
  };

  ns.obtenerAreas = function (cb) {
    get(API + '/areas', cb);
  };

  ns.obtenerArea = function (id, cb) {
    get(API + '/areas/' + id, cb);
  };

  ns.obtenerContactos = function (cb) {
    get(API + '/contactos', cb);
  };

  ns.obtenerContacto = function (id, cb) {
    get(API + '/contactos/' + id, cb);
  };

  /* ─────── ESTADÍSTICAS ─────── */

  ns.obtenerStats = function (cb) {
    get(API + '/visitas/stats', cb);
  };

  ns.obtenerStatsActividades = function (cb) {
    get(API + '/visitas/stats/actividades', cb);
  };

})(window.ConectarSJ);
