package com.conectarsj.backend.service;

import com.conectarsj.backend.model.Visita;
import com.conectarsj.backend.repository.VisitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class VisitaService {

    @Autowired
    private VisitaRepository visitaRepository;

    @Transactional
    public synchronized void registrar(String pagina) {
        LocalDate hoy = LocalDate.now();
        Visita visita = visitaRepository.findByPaginaAndFecha(pagina, hoy)
                .orElseGet(() -> {
                    Visita v = new Visita();
                    v.setPagina(pagina);
                    v.setFecha(hoy);
                    v.setContador(0);
                    return v;
                });
        visita.setContador(visita.getContador() + 1);
        visitaRepository.save(visita);
    }

    public Map<String, Object> obtenerEstadisticas() {
        LocalDate hoy = LocalDate.now();
        LocalDate inicioSemana = hoy.minusDays(6);

        return Map.of(
                "total", visitaRepository.sumTotal(),
                "hoy", visitaRepository.sumByFecha(hoy),
                "semana", visitaRepository.sumDesde(inicioSemana)
        );
    }

    public Map<Long, Long> visitasPorActividad() {
        Map<Long, Long> result = new HashMap<>();
        for (Object[] row : visitaRepository.sumPorActividad()) {
            String pagina = (String) row[0];
            Long total = ((Number) row[1]).longValue();
            try {
                Long id = Long.parseLong(pagina.replace("actividad-", ""));
                result.put(id, total);
            } catch (NumberFormatException ignored) {}
        }
        return result;
    }
}
