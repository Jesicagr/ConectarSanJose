package com.conectarsj.backend.controller;

import com.conectarsj.backend.dto.ErrorResponse;
import com.conectarsj.backend.dto.JwtResponse;
import com.conectarsj.backend.dto.LoginRequest;
import com.conectarsj.backend.config.JwtProvider;
import com.conectarsj.backend.service.AdministradorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticación", description = "Endpoints públicos para login, recuperación y restablecimiento de contraseña")
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private AdministradorService adminService;

    @Operation(summary = "Iniciar sesión", description = "Autentica un administrador con email y contraseña, devuelve un token JWT")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Autenticación exitosa", content = @Content(schema = @Schema(implementation = JwtResponse.class))),
        @ApiResponse(responseCode = "401", description = "Credenciales inválidas", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            String token = jwtProvider.generateToken(auth);
            return ResponseEntity.ok(new JwtResponse(token));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(401, "Usuario o contraseña incorrectos"));
        }
    }

    @Operation(summary = "Solicitar recuperación de contraseña", description = "Envía un correo con un enlace de recuperación si el email existe en el sistema")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Correo enviado (respuesta genérica por seguridad)", content = @Content(schema = @Schema(implementation = Map.class))),
        @ApiResponse(responseCode = "400", description = "Email no proporcionado", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(400, "El email es requerido"));
        }
        adminService.procesarRecuperacionPassword(email);
        return ResponseEntity.ok(Map.of("mensaje", "Si el email existe, recibirás un enlace de recuperación."));
    }

    @Operation(summary = "Restablecer contraseña", description = "Cambia la contraseña usando un token de recuperación válido")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Contraseña actualizada correctamente", content = @Content(schema = @Schema(implementation = Map.class))),
        @ApiResponse(responseCode = "400", description = "Token inválido/expirado o datos faltantes", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String password = body.get("password");

        if (token == null || token.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(400, "Token y contraseña son requeridos"));
        }

        boolean actualizado = adminService.actualizarPasswordConToken(token, password);
        if (actualizado) {
            return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada correctamente."));
        } else {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(400, "El token es inválido o ha expirado."));
        }
    }
}