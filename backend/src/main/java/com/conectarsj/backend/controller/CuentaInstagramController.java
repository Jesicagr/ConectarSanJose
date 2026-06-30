package com.conectarsj.backend.controller;

import com.conectarsj.backend.model.CuentaInstagram;
import com.conectarsj.backend.service.CuentaInstagramService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/instagram/cuentas")
public class CuentaInstagramController {

    private final CuentaInstagramService service;

    public CuentaInstagramController(CuentaInstagramService service) {
        this.service = service;
    }

    @GetMapping
    public List<CuentaInstagram> listar() {
        return service.listarTodas();
    }

    @PostMapping
    public ResponseEntity<?> agregar(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        if (username == null || username.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username es requerido"));
        }
        try {
            CuentaInstagram cuenta = service.agregar(username.trim().toLowerCase());
            return ResponseEntity.ok(cuenta);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            service.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        String username = body.containsKey("username") ? (String) body.get("username") : null;
        Boolean activo = body.containsKey("activo") ? (Boolean) body.get("activo") : null;
        if (username != null) {
            username = username.trim().toLowerCase();
        }
        try {
            CuentaInstagram cuenta = service.actualizar(id, username, activo);
            return ResponseEntity.ok(cuenta);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/refrescar")
    public ResponseEntity<?> refrescarTodas() {
        service.refrescarTodas();
        return ResponseEntity.ok(Map.of("message", "Refrescando todas las cuentas"));
    }

    @PostMapping("/{username}/refrescar")
    public ResponseEntity<?> refrescar(@PathVariable String username) {
        service.refrescar(username);
        return ResponseEntity.ok(Map.of("message", "Refrescando @" + username));
    }
}
