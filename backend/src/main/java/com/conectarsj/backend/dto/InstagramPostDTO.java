package com.conectarsj.backend.dto;

import com.conectarsj.backend.model.PublicacionInstagram;

import java.time.LocalDateTime;

public class InstagramPostDTO {

    private Long id;
    private String username;
    private String imageUrl;
    private String caption;
    private String postUrl;
    private LocalDateTime postTimestamp;
    private LocalDateTime fetchedAt;
    private String shortcode;

    public InstagramPostDTO() {}

    public static InstagramPostDTO fromEntity(PublicacionInstagram p) {
        InstagramPostDTO dto = new InstagramPostDTO();
        dto.id = p.getId();
        dto.username = p.getUsername();
        dto.imageUrl = "/api/instagram/image/" + p.getId();
        dto.caption = p.getCaption();
        dto.postUrl = p.getPostUrl();
        dto.postTimestamp = p.getPostTimestamp();
        dto.fetchedAt = p.getFetchedAt();
        dto.shortcode = p.getShortcode();
        return dto;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getImageUrl() { return imageUrl; }
    public String getCaption() { return caption; }
    public String getPostUrl() { return postUrl; }
    public LocalDateTime getPostTimestamp() { return postTimestamp; }
    public LocalDateTime getFetchedAt() { return fetchedAt; }
    public String getShortcode() { return shortcode; }
}
