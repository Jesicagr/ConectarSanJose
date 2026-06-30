package com.conectarsj.backend.controller;

import com.conectarsj.backend.dto.InstagramPostDTO;
import com.conectarsj.backend.service.InstagramScraperService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instagram")
public class InstagramController {

    private final InstagramScraperService instagramScraperService;

    public InstagramController(InstagramScraperService instagramScraperService) {
        this.instagramScraperService = instagramScraperService;
    }

    @GetMapping("/image/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        byte[] image = instagramScraperService.getImageBytes(id);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .header("Cache-Control", "max-age=86400")
                .body(image);
    }

    @GetMapping("/posts")
    public List<InstagramPostDTO> obtenerTodos() {
        return instagramScraperService.obtenerPosts();
    }

    @GetMapping("/posts/{username}")
    public List<InstagramPostDTO> obtenerPorUsuario(@PathVariable String username) {
        return instagramScraperService.obtenerPostsPorUsuario(username);
    }

    @PostMapping("/refrescar")
    public ResponseEntity<String> refrescar() {
        instagramScraperService.refrescarTodas();
        return ResponseEntity.ok("Refresco iniciado");
    }

    @PostMapping("/refrescar/{username}")
    public ResponseEntity<String> refrescarCuenta(@PathVariable String username) {
        instagramScraperService.refrescarCuenta(username);
        return ResponseEntity.ok("Cuenta " + username + " refrescada");
    }
}
