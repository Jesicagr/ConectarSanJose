package com.conectarsj.backend.service;

import com.conectarsj.backend.model.Visita;
import com.conectarsj.backend.repository.VisitaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VisitaServiceTest {

    @Mock
    private VisitaRepository visitaRepository;

    @InjectMocks
    private VisitaService visitaService;

    @Test
    void registrar_PrimeraVisitaDelDia_CreaNuevoRegistro() {
        String pagina = "actividad-1";
        LocalDate hoy = LocalDate.now();

        when(visitaRepository.findByPaginaAndFecha(pagina, hoy))
                .thenReturn(Optional.empty());

        visitaService.registrar(pagina);

        verify(visitaRepository).findByPaginaAndFecha(pagina, hoy);
        verify(visitaRepository).save(argThat(v ->
                v.getPagina().equals(pagina) &&
                v.getFecha().equals(hoy) &&
                v.getContador() == 1
        ));
    }

    @Test
    void registrar_VisitaRepetidaEnElDia_IncrementaContador() {
        String pagina = "actividad-1";
        LocalDate hoy = LocalDate.now();
        Visita visitaExistente = new Visita();
        visitaExistente.setPagina(pagina);
        visitaExistente.setFecha(hoy);
        visitaExistente.setContador(5);

        when(visitaRepository.findByPaginaAndFecha(pagina, hoy))
                .thenReturn(Optional.of(visitaExistente));

        visitaService.registrar(pagina);

        verify(visitaRepository).save(argThat(v ->
                v.getContador() == 6
        ));
    }

    @Test
    void obtenerEstadisticas_DevuelveMapaConTotales() {
        LocalDate hoy = LocalDate.now();
        when(visitaRepository.sumTotal()).thenReturn(100L);
        when(visitaRepository.sumByFecha(hoy)).thenReturn(10L);
        when(visitaRepository.sumDesde(hoy.minusDays(6))).thenReturn(50L);

        Map<String, Object> stats = visitaService.obtenerEstadisticas();

        assertEquals(100L, stats.get("total"));
        assertEquals(10L, stats.get("hoy"));
        assertEquals(50L, stats.get("semana"));
    }
}
