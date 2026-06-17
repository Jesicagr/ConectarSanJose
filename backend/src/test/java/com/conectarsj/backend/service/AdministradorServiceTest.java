package com.conectarsj.backend.service;

import com.conectarsj.backend.model.Administrador;
import com.conectarsj.backend.model.Rol;
import com.conectarsj.backend.repository.AdministradorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdministradorServiceTest {

    @Mock
    private AdministradorRepository administradorRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AdministradorService administradorService;

    private Administrador admin;

    @BeforeEach
    void setUp() {
        admin = new Administrador();
        admin.setId(1L);
        admin.setEmail("admin@sanjose.com");
        admin.setPasswordHash("$2a$10$hashSimulado12345");
        admin.setRol(Rol.SUPER_ADMIN);
    }

    @Test
    void verificarLogin_CredencialesCorrectas_DevuelveTrue() {
        when(administradorRepository.findByEmail("admin@sanjose.com"))
                .thenReturn(Optional.of(admin));
        when(passwordEncoder.matches("admin123", admin.getPasswordHash()))
                .thenReturn(true);

        boolean resultado = administradorService.verificarLogin("admin@sanjose.com", "admin123");

        assertTrue(resultado);
        verify(administradorRepository).findByEmail("admin@sanjose.com");
        verify(passwordEncoder).matches("admin123", admin.getPasswordHash());
    }

    @Test
    void verificarLogin_CredencialesIncorrectas_DevuelveFalse() {
        when(administradorRepository.findByEmail("admin@sanjose.com"))
                .thenReturn(Optional.of(admin));
        when(passwordEncoder.matches("wrongpassword", admin.getPasswordHash()))
                .thenReturn(false);

        boolean resultado = administradorService.verificarLogin("admin@sanjose.com", "wrongpassword");

        assertFalse(resultado);
    }

    @Test
    void verificarLogin_EmailNoExistente_DevuelveFalse() {
        when(administradorRepository.findByEmail("noexiste@test.com"))
                .thenReturn(Optional.empty());

        boolean resultado = administradorService.verificarLogin("noexiste@test.com", "password");

        assertFalse(resultado);
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }
}
