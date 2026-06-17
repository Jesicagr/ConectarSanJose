package com.conectarsj.backend.controller;

import com.conectarsj.backend.dto.ErrorResponse;
import com.conectarsj.backend.dto.RegisterUserRequest;
import com.conectarsj.backend.model.Administrador;
import com.conectarsj.backend.model.Rol;
import com.conectarsj.backend.repository.AdministradorRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "Usuarios", description = "Gestión de administradores (solo SUPER_ADMIN)")
public class UserController {

    private final AdministradorRepository repo;
    private final BCryptPasswordEncoder encoder;

    public UserController(AdministradorRepository repo, BCryptPasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    @Operation(summary = "Listar administradores", description = "Devuelve todos los administradores registrados")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de administradores", content = @Content(schema = @Schema(implementation = Administrador.class))),
        @ApiResponse(responseCode = "403", description = "Acceso denegado (requiere rol SUPER_ADMIN)", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping
    public ResponseEntity<List<Administrador>> listar() {
        return ResponseEntity.ok(repo.findAll());
    }

    @Operation(summary = "Crear administrador", description = "Registra un nuevo administrador en el sistema")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Administrador creado", content = @Content(schema = @Schema(implementation = Administrador.class))),
        @ApiResponse(responseCode = "400", description = "Datos inválidos (email vacío, contraseña corta)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "409", description = "Ya existe un usuario con ese email", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody RegisterUserRequest req) {
        if (req.getEmail() == null || req.getEmail().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(400, "El email es requerido"));
        }
        if (req.getPassword() == null || req.getPassword().length() < 6) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(400, "La contraseña debe tener al menos 6 caracteres"));
        }

        if (repo.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse(409, "Ya existe un usuario con ese email"));
        }

        Rol rol = Rol.ADMIN;
        if (req.getRol() != null && req.getRol().equalsIgnoreCase("SUPER_ADMIN")) {
            rol = Rol.SUPER_ADMIN;
        }

        Administrador admin = new Administrador();
        admin.setEmail(req.getEmail());
        admin.setPasswordHash(encoder.encode(req.getPassword()));
        admin.setRol(rol);

        Administrador guardado = repo.save(admin);
        guardado.setPasswordHash(null);

        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    @Operation(summary = "Eliminar administrador", description = "Elimina un administrador por su ID")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Administrador eliminado"),
        @ApiResponse(responseCode = "404", description = "Administrador no encontrado", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
