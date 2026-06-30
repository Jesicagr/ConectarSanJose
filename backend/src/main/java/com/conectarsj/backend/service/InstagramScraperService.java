package com.conectarsj.backend.service;

import com.conectarsj.backend.dto.InstagramPostDTO;
import com.conectarsj.backend.model.CuentaInstagram;
import com.conectarsj.backend.model.PublicacionInstagram;
import com.conectarsj.backend.repository.CuentaInstagramRepository;
import com.conectarsj.backend.repository.InstagramRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.annotation.PostConstruct;

@Service
public class InstagramScraperService {

    private static final Logger log = LoggerFactory.getLogger(InstagramScraperService.class);
    private static final String IG_APP_ID = "936619743392459";

    private final InstagramRepository repository;
    private final CuentaInstagramRepository cuentaRepository;
    private final ObjectMapper mapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .followRedirects(HttpClient.Redirect.NORMAL)
            .build();

    public InstagramScraperService(InstagramRepository repository, CuentaInstagramRepository cuentaRepository) {
        this.repository = repository;
        this.cuentaRepository = cuentaRepository;
    }

    @PostConstruct
    public void seedCuentas() {
        if (cuentaRepository.count() > 0) return;
        String[] defaults = {
            "munisanjoseer", "sjmujeresgenerodiversidad", "sjsaludybienestarsocial",
            "sjareadeinclusion", "caps.sjciudad", "sjdeportes",
            "turismosanjose", "sjcultura_", "sjeducacion", "sjareadejuventudes"
        };
        for (int i = 0; i < defaults.length; i++) {
            cuentaRepository.save(new CuentaInstagram(defaults[i], i));
        }
        log.info("Seed de {} cuentas de Instagram", defaults.length);
    }

    @Scheduled(fixedRate = 3_600_000, initialDelay = 10_000)
    @Transactional
    public synchronized void refrescarTodas() {
        List<CuentaInstagram> cuentas = cuentaRepository.findByActivoTrueOrderByOrdenAsc();
        log.info("Refresco de Instagram para {} cuentas", cuentas.size());
        for (CuentaInstagram cuenta : cuentas) {
            String username = cuenta.getUsername();
            try {
                List<PublicacionInstagram> posts = scrapeProfile(username);
                guardarNuevos(username, posts);
            } catch (Exception e) {
                log.error("Error al scrapear {}: {}", username, e.getMessage());
            }
        }
    }

    private void guardarNuevos(String username, List<PublicacionInstagram> posts) {
        if (posts.isEmpty()) return;
        List<PublicacionInstagram> existentes = repository.findByUsernameOrderByPostTimestampDesc(username);
        Set<String> shortcodesExistentes = existentes.stream()
            .map(PublicacionInstagram::getShortcode)
            .filter(s -> s != null && !s.isEmpty())
            .collect(Collectors.toSet());
        List<PublicacionInstagram> nuevos = posts.stream()
            .filter(p -> !shortcodesExistentes.contains(p.getShortcode()))
            .toList();
        if (!nuevos.isEmpty()) {
            repository.saveAll(nuevos);
        }
        log.info("{}: {} nuevos, {} existentes", username, nuevos.size(), existentes.size());
    }

    public List<InstagramPostDTO> obtenerPosts() {
        List<String> activeUsernames = cuentaRepository.findByActivoTrueOrderByOrdenAsc()
                .stream()
                .map(CuentaInstagram::getUsername)
                .toList();
        if (activeUsernames.isEmpty()) return List.of();
        return repository.findByUsernameInOrderByPostTimestampDesc(activeUsernames)
                .stream()
                .map(InstagramPostDTO::fromEntity)
                .toList();
    }

    public List<InstagramPostDTO> obtenerPostsPorUsuario(String username) {
        return repository.findByUsernameOrderByPostTimestampDesc(username)
                .stream()
                .map(InstagramPostDTO::fromEntity)
                .toList();
    }

    List<PublicacionInstagram> scrapeProfile(String username) throws Exception {
        List<PublicacionInstagram> posts = fetchViaApi(username);
        if (posts.isEmpty()) {
            posts = fetchViaGraphQL(username);
        }
        if (posts.isEmpty()) {
            posts = fetchViaHtml(username);
        }
        if (posts.isEmpty()) {
            log.warn("No se pudo obtener posts para {} con ningun metodo", username);
        }
        LocalDateTime now = LocalDateTime.now();
        for (PublicacionInstagram p : posts) {
            p.setFetchedAt(now);
        }
        return posts;
    }

    private List<PublicacionInstagram> fetchViaApi(String username) {
        List<PublicacionInstagram> posts = new ArrayList<>();
        try {
            String url = "https://www.instagram.com/api/v1/users/web_profile_info/?username=" + username;
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36")
                    .header("Accept", "application/json")
                    .header("X-IG-App-ID", IG_APP_ID)
                    .header("Referer", "https://www.instagram.com/")
                    .header("Sec-Fetch-Site", "same-origin")
                    .build();

            HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
            String body = resp.body();

            if (resp.statusCode() == 200) {
                JsonNode root = mapper.readTree(body);
                JsonNode user = root.at("/data/user");
                if (user == null || user.isMissingNode()) {
                    return posts;
                }
                JsonNode edges = user.at("/edge_owner_to_timeline_media/edges");
                if (edges != null && edges.isArray()) {
                    parseEdges(edges, username, posts);
                    log.info("fetchViaApi {}: {} posts", username, posts.size());
                }
            }
        } catch (Exception e) {
            log.warn("fetchViaApi {} fallo: {}", username, e.getMessage());
        }
        return posts;
    }

    private List<PublicacionInstagram> fetchViaGraphQL(String username) {
        List<PublicacionInstagram> posts = new ArrayList<>();
        try {
            String queryHash = "58b30ea683e1bb4b9c41eac5dcbfaaba";
            String variables = "{\"username\":\"" + username + "\",\"after\":null,\"first\":12}";
            String url = "https://www.instagram.com/graphql/query/?query_hash=" + queryHash + "&variables="
                    + java.net.URLEncoder.encode(variables, "UTF-8");

            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                    .header("Accept", "application/json")
                    .header("X-IG-App-ID", IG_APP_ID)
                    .header("Referer", "https://www.instagram.com/" + username + "/")
                    .build();

            HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
            if (resp.statusCode() == 200) {
                JsonNode root = mapper.readTree(resp.body());
                JsonNode edges = root.at("/data/user/edge_owner_to_timeline_media/edges");
                if (edges != null && edges.isArray() && edges.size() > 0) {
                    parseEdges(edges, username, posts);
                    log.info("fetchViaGraphQL {}: {} posts", username, posts.size());
                }
            }
        } catch (Exception e) {
            log.warn("fetchViaGraphQL {} fallo: {}", username, e.getMessage());
        }
        return posts;
    }

    private List<PublicacionInstagram> fetchViaHtml(String username) {
        List<PublicacionInstagram> posts = new ArrayList<>();
        try {
            String url = "https://www.instagram.com/" + username + "/";
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36")
                    .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
                    .header("Accept-Language", "es-AR,es;q=0.9,en;q=0.8")
                    .header("Referer", "https://www.instagram.com/")
                    .header("Sec-Fetch-Dest", "document")
                    .header("Sec-Fetch-Mode", "navigate")
                    .header("Sec-Fetch-Site", "none")
                    .header("Sec-Fetch-User", "?1")
                    .build();

            HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
            String html = resp.body();

            if (resp.statusCode() != 200 && resp.statusCode() != 302) {
                log.warn("fetchViaHtml {} status: {}", username, resp.statusCode());
                return posts;
            }

            org.jsoup.nodes.Document doc = org.jsoup.Jsoup.parse(html);
            org.jsoup.nodes.Element script = doc.selectFirst("script#__NEXT_DATA__[type=\"application/json\"]");
            if (script != null) {
                JsonNode root = mapper.readTree(script.data());
                JsonNode edges = root.at("/props/pageProps/user/edge_owner_to_timeline_media/edges");
                if (edges != null && edges.isArray() && edges.size() > 0) {
                    parseEdges(edges, username, posts);
                    log.info("fetchViaHtml __NEXT_DATA__ {}: {} posts", username, posts.size());
                    return posts;
                }
            }

            String body = resp.body();
            java.util.regex.Pattern p = java.util.regex.Pattern.compile(
                    "window\\.__INITIAL_STATE__\\s*=\\s*(\\{.+?});\\s*</script>",
                    java.util.regex.Pattern.DOTALL);
            java.util.regex.Matcher m = p.matcher(body);
            if (m.find()) {
                JsonNode root = mapper.readTree(m.group(1));
                JsonNode edges = root.at("/entry_data/ProfilePage/0/graphql/user/edge_owner_to_timeline_media/edges");
                if (edges != null && edges.isArray() && edges.size() > 0) {
                    parseEdges(edges, username, posts);
                    log.info("fetchViaHtml __INITIAL_STATE__ {}: {} posts", username, posts.size());
                }
            }
        } catch (Exception e) {
            log.warn("fetchViaHtml {} fallo: {}", username, e.getMessage());
        }
        return posts;
    }

    private void parseEdges(JsonNode edges, String username, List<PublicacionInstagram> posts) {
        for (JsonNode edge : edges) {
            try {
                JsonNode node = edge.has("node") ? edge.get("node") : edge;
                PublicacionInstagram post = new PublicacionInstagram();
                post.setUsername(username);
                post.setShortcode(node.has("shortcode") ? node.get("shortcode").asText("") : "");

                String displayUrl = node.has("display_url") && !node.get("display_url").isNull()
                        ? node.get("display_url").asText()
                        : node.has("display_src") ? node.get("display_src").asText("") : "";

                if (displayUrl.isEmpty()) {
                    continue;
                }
                post.setImageUrl(displayUrl);

                String caption = "";
                JsonNode captionNode = node.at("/edge_media_to_caption/edges");
                if (captionNode.isArray() && captionNode.size() > 0) {
                    caption = captionNode.get(0).at("/node/text").asText("");
                }
                if (caption.isEmpty() && node.has("caption")) {
                    caption = node.get("caption").asText("");
                }
                post.setCaption(caption);

                if (node.has("taken_at_timestamp") && !node.get("taken_at_timestamp").isNull()) {
                    long ts = node.get("taken_at_timestamp").asLong();
                    post.setPostTimestamp(LocalDateTime.ofEpochSecond(ts, 0, ZoneOffset.UTC));
                }

                String sc = post.getShortcode();
                if (sc != null && !sc.isEmpty()) {
                    post.setPostUrl("https://www.instagram.com/p/" + sc + "/");
                }

                posts.add(post);
            } catch (Exception e) {
                log.warn("Error parseando post de {}: {}", username, e.getMessage());
            }
        }
    }

    public byte[] getImageBytes(Long id) {
        PublicacionInstagram post = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post no encontrado: " + id));
        String url = post.getImageUrl();
        try {
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36")
                    .header("Accept", "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8")
                    .header("Referer", "https://www.instagram.com/")
                    .build();
            HttpResponse<byte[]> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofByteArray());
            if (resp.statusCode() == 200) {
                return resp.body();
            }
            throw new RuntimeException("Error fetching image, status: " + resp.statusCode());
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException("Error fetching image: " + e.getMessage());
        }
    }

    @Transactional
    public void refrescarCuenta(String username) {
        try {
            List<PublicacionInstagram> posts = scrapeProfile(username);
            guardarNuevos(username, posts);
        } catch (Exception e) {
            log.error("Error al refrescar {}: {}", username, e.getMessage());
        }
    }
}
