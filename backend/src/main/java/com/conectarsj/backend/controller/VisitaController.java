package com.conectarsj.backend.controller;

import com.conectarsj.backend.service.VisitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/visitas")
public class VisitaController {

    @Autowired
    private VisitaService visitaService;

    @PostMapping
    public void registrar(@RequestBody Map<String, String> body) {
        String pagina = body.getOrDefault("pagina", "desconocida");
        visitaService.registrar(pagina);
    }

    @GetMapping("/stats")
    public Map<String, Object> estadisticas() {
        return visitaService.obtenerEstadisticas();
    }

    @GetMapping("/stats/actividades")
    public Map<Long, Long> visitasPorActividad() {
        return visitaService.visitasPorActividad();
    }
}
