package com.conectarsj.backend.service;

import com.conectarsj.backend.model.Administrador;
import com.conectarsj.backend.repository.AdministradorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AdministradorService {

    private static final Logger log = LoggerFactory.getLogger(AdministradorService.class);

    @Autowired
    private AdministradorRepository administradorRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    public Administrador registrar(Administrador admin) {
        String passwordHasheado = passwordEncoder.encode(admin.getPasswordHash());
        admin.setPasswordHash(passwordHasheado);
        return administradorRepository.save(admin);
    }

    public boolean verificarLogin(String email, String passwordPlano) {
        Optional<Administrador> adminOpt = administradorRepository.findByEmail(email);
        if (adminOpt.isPresent()) {
            Administrador admin = adminOpt.get();
            return passwordEncoder.matches(passwordPlano, admin.getPasswordHash());
        }
        return false;
    }

    public boolean procesarRecuperacionPassword(String email) {
        Optional<Administrador> adminOpt = administradorRepository.findByEmail(email);

        if (adminOpt.isPresent()) {
            Administrador admin = adminOpt.get();

            String token = UUID.randomUUID().toString();
            admin.setTokenRecuperacion(token);
            admin.setTokenExpiracion(LocalDateTime.now().plusMinutes(15));
            administradorRepository.save(admin);

            enviarEmailRecuperacionSimulado(admin.getEmail(), token);
            return true;
        }
        return false;
    }

    public boolean actualizarPasswordConToken(String token, String nuevaPasswordPlano) {
        Optional<Administrador> adminOpt = administradorRepository.findByTokenRecuperacion(token);

        if (adminOpt.isPresent()) {
            Administrador admin = adminOpt.get();

            if (admin.getTokenExpiracion().isAfter(LocalDateTime.now())) {
                admin.setPasswordHash(passwordEncoder.encode(nuevaPasswordPlano));
                admin.setTokenRecuperacion(null);
                admin.setTokenExpiracion(null);
                administradorRepository.save(admin);
                return true;
            }
        }
        return false;
    }

    private void enviarEmailRecuperacionSimulado(String emailDestino, String token) {
        String urlRecuperacion = "http://localhost:4200/recuperar-password?token=" + token;
        String asunto = "Recuperación de contraseña - Conectar San José";
        String cuerpo = """
            Hola,
            Has solicitado restablecer tu contraseña.
            Hacé clic en el siguiente enlace para crear una nueva contraseña:
            %s
            Este enlace expira en 15 minutos.
            Si no solicitaste este cambio, ignorá este mensaje.
            Saludos,
            Equipo de Conectar San José
            """.formatted(urlRecuperacion);

        try {
            emailService.enviarEmail(emailDestino, asunto, cuerpo);
            log.info("Email de recuperación enviado a: {}", emailDestino);
        } catch (Exception e) {
            log.error("Error al enviar email de recuperación a {}: {}", emailDestino, e.getMessage(), e);
            log.warn("Fallo el envío real. Enlace de recuperación: {}", urlRecuperacion);
        }
    }
}