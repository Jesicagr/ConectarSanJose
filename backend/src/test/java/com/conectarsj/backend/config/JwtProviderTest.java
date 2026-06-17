package com.conectarsj.backend.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JwtProviderTest {

    private JwtProvider jwtProvider;

    @BeforeEach
    void setUp() {
        jwtProvider = new JwtProvider();
    }

    @Test
    void generateToken_DevuelveTokenValido() {
        User user = new User("admin@sanjose.com", "password",
                List.of(new SimpleGrantedAuthority("ROLE_SUPER_ADMIN")));
        Authentication auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());

        String token = jwtProvider.generateToken(auth);

        assertNotNull(token);
        assertTrue(token.startsWith("eyJ"));
        assertTrue(token.split("\\.").length == 3);
    }

    @Test
    void validateToken_TokenValido_DevuelveTrue() {
        User user = new User("admin@sanjose.com", "password",
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
        Authentication auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        String token = jwtProvider.generateToken(auth);

        boolean valido = jwtProvider.validateToken(token);

        assertTrue(valido);
    }

    @Test
    void validateToken_TokenInvalido_DevuelveFalse() {
        boolean valido = jwtProvider.validateToken("token.invalido.123");

        assertFalse(valido);
    }

    @Test
    void getRolFromToken_DevuelveRolCorrecto() {
        User user = new User("admin@sanjose.com", "password",
                List.of(new SimpleGrantedAuthority("ROLE_SUPER_ADMIN")));
        Authentication auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        String token = jwtProvider.generateToken(auth);

        String rol = jwtProvider.getRolFromToken(token);

        assertEquals("SUPER_ADMIN", rol);
    }

    @Test
    void getUsernameFromToken_DevuelveEmailCorrecto() {
        User user = new User("admin@sanjose.com", "password",
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
        Authentication auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        String token = jwtProvider.generateToken(auth);

        String username = jwtProvider.getUsernameFromToken(token);

        assertEquals("admin@sanjose.com", username);
    }
}
