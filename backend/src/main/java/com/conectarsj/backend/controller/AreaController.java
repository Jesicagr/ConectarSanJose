package com.conectarsj.backend.controller;

import com.conectarsj.backend.model.Area;
import com.conectarsj.backend.service.AreaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/areas")
@CrossOrigin(origins = "http://localhost:4200")
public class AreaController {

    @Autowired
    private AreaService areaService;

    @GetMapping
    public List<Area> listarTodas() {
        return areaService.obtenerTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Area> obtenerPorId(@PathVariable Integer id) {
        return areaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Area crear(@RequestBody Area area) {
        return areaService.guardar(area);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Area> actualizar(@PathVariable Integer id, @RequestBody Area area) {
        return areaService.obtenerPorId(id)
                .map(existing -> {
                    area.setId(id);
                    return ResponseEntity.ok(areaService.guardar(area));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if (areaService.obtenerPorId(id).isPresent()) {
            areaService.eliminar(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
