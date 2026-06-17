package com.conectarsj.backend.controller;

import com.conectarsj.backend.model.Actividad;
import com.conectarsj.backend.model.Area;
import com.conectarsj.backend.model.HorarioActividad;
import com.conectarsj.backend.model.Sede;
import com.conectarsj.backend.model.DiaSemana;
import com.conectarsj.backend.repository.ActividadRepository;
import com.conectarsj.backend.repository.SedeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ActividadControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private SedeRepository sedeRepository;

    @Autowired
    private ActividadRepository actividadRepository;

    private Sede sedePersistida;

    @BeforeEach
    void setUp() {
        actividadRepository.deleteAll();
        sedeRepository.deleteAll();

        Sede sede = new Sede();
        sede.setNombre("Sede Test Integracion");
        sede.setDireccion("Direccion Test");
        sede.setTelefono("123456789");
        sede.setLatitud(-32.2);
        sede.setLongitud(-58.2);
        sedePersistida = sedeRepository.save(sede);
    }

    @Test
    void crearActividad_CaminoFeliz_DevuelveActividadCreada() {
        Actividad actividad = new Actividad();
        actividad.setTitulo("Taller de integracion");
        actividad.setDescripcion("Test de integracion");
        actividad.setSede(sedePersistida);
        actividad.setFechaInicio(LocalDate.now().plusDays(1));
        actividad.setFechaFin(LocalDate.now().plusDays(1));
        actividad.setEncargado("Encargado Test");
        actividad.setTelefono("123456");
        actividad.setStatus("Confirmado");

        HorarioActividad horario = new HorarioActividad();
        horario.setDiaSemana(DiaSemana.LUNES);
        horario.setHoraInicio(LocalTime.of(10, 0));
        horario.setHoraFin(LocalTime.of(12, 0));
        actividad.setHorarios(List.of(horario));

        ResponseEntity<Actividad> response = restTemplate.postForEntity(
                "/api/actividades", actividad, Actividad.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isNotNull();
        assertThat(response.getBody().getTitulo()).isEqualTo("Taller de integracion");
        assertThat(response.getBody().getSede().getId()).isEqualTo(sedePersistida.getId());
    }

    @Test
    void crearActividad_ConFechaPasada_DevuelveBadRequest() {
        Actividad actividad = new Actividad();
        actividad.setTitulo("Taller con fecha pasada");
        actividad.setSede(sedePersistida);
        actividad.setFechaInicio(LocalDate.now().minusDays(5));
        actividad.setStatus("Confirmado");

        ResponseEntity<String> response = restTemplate.postForEntity(
                "/api/actividades", actividad, String.class);

        assertThat(response.getStatusCode()).isIn(HttpStatus.BAD_REQUEST, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Test
    void obtenerActividadPorId_Existente_DevuelveActividad() {
        Actividad actividad = new Actividad();
        actividad.setTitulo("Actividad para buscar");
        actividad.setSede(sedePersistida);
        actividad.setFechaInicio(LocalDate.now().plusDays(1));

        Actividad creada = restTemplate.postForObject("/api/actividades", actividad, Actividad.class);

        ResponseEntity<Actividad> response = restTemplate.getForEntity(
                "/api/actividades/" + creada.getId(), Actividad.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isEqualTo(creada.getId());
    }

    @Test
    void obtenerActividadPorId_Inexistente_DevuelveNotFound() {
        ResponseEntity<Actividad> response = restTemplate.getForEntity(
                "/api/actividades/99999", Actividad.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
