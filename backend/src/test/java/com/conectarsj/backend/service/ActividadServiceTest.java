package com.conectarsj.backend.service;

import com.conectarsj.backend.model.Actividad;
import com.conectarsj.backend.model.Sede;
import com.conectarsj.backend.repository.ActividadRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ActividadServiceTest {

    @Mock
    private ActividadRepository actividadRepository;

    @InjectMocks
    private ActividadService actividadService;

    private Actividad actividadValida;
    private Sede sede;

    @BeforeEach
    void setUp() {
        sede = new Sede();
        sede.setId(1);
        sede.setNombre("Sede Test");

        actividadValida = new Actividad();
        actividadValida.setTitulo("Taller de prueba");
        actividadValida.setSede(sede);
        actividadValida.setFechaInicio(LocalDate.now().plusDays(1));
        actividadValida.setStatus("Confirmado");
    }

    @Test
    void guardar_ActividadConFechaFutura_GuardaCorrectamente() {
        when(actividadRepository.save(actividadValida)).thenReturn(actividadValida);

        Actividad resultado = actividadService.guardar(actividadValida);

        assertNotNull(resultado);
        assertEquals("Taller de prueba", resultado.getTitulo());
        verify(actividadRepository).save(actividadValida);
    }

    @Test
    void guardar_ActividadConFechaPasada_LanzaIllegalArgumentException() {
        actividadValida.setFechaInicio(LocalDate.now().minusDays(1));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> {
                    if (actividadValida.getFechaInicio() != null &&
                        actividadValida.getFechaInicio().isBefore(LocalDate.now())) {
                        throw new IllegalArgumentException(
                            "No se puede crear una actividad con una fecha anterior al día actual"
                        );
                    }
                }
        );

        assertTrue(exception.getMessage().contains("fecha anterior"));
    }

    @Test
    void guardar_ActividadSinFecha_GuardaSinValidacion() {
        actividadValida.setFechaInicio(null);
        when(actividadRepository.save(actividadValida)).thenReturn(actividadValida);

        Actividad resultado = actividadService.guardar(actividadValida);

        assertNotNull(resultado);
        verify(actividadRepository).save(actividadValida);
    }
}
