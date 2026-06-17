package com.conectarsj.backend.controller;

import com.conectarsj.backend.model.ContactoEmergencia;
import com.conectarsj.backend.service.ContactoEmergenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contactos")
@CrossOrigin(origins = "http://localhost:4200")
public class ContactoEmergenciaController {

    @Autowired
    private ContactoEmergenciaService contactoEmergenciaService;

    @GetMapping
    public List<ContactoEmergencia> listarTodos() {
        return contactoEmergenciaService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactoEmergencia> obtenerPorId(@PathVariable Integer id) {
        return contactoEmergenciaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ContactoEmergencia crear(@RequestBody ContactoEmergencia contacto) {
        return contactoEmergenciaService.guardar(contacto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactoEmergencia> actualizar(@PathVariable Integer id, @RequestBody ContactoEmergencia contacto) {
        return contactoEmergenciaService.obtenerPorId(id)
                .map(existing -> {
                    contacto.setId(id);
                    return ResponseEntity.ok(contactoEmergenciaService.guardar(contacto));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if (contactoEmergenciaService.obtenerPorId(id).isPresent()) {
            contactoEmergenciaService.eliminar(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
