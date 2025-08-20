package com.vetverse.hss.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * Test Controller - Keycloak OAuth2 entegrasyonunu test etmek için
 */
@RestController
@RequestMapping("/api/test")
public class TestController {

    /**
     * Public endpoint - kimlik doğrulama gerektirmez
     */
    @GetMapping("/public")
    public ResponseEntity<Map<String, String>> publicEndpoint() {
        return ResponseEntity.ok(Map.of(
            "message", "Bu public endpoint - kimlik doğrulama gerekmiyor",
            "status", "success"
        ));
    }

    /**
     * Protected endpoint - kimlik doğrulama gerektirir
     */
    @GetMapping("/protected")
    public ResponseEntity<Map<String, Object>> protectedEndpoint(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(Map.of(
            "message", "Bu protected endpoint - kimlik doğrulama başarılı",
            "user", jwt.getClaimAsString("preferred_username"),
            "email", jwt.getClaimAsString("email"),
            "roles", jwt.getClaimAsMap("realm_access"),
            "status", "success"
        ));
    }

    /**
     * Admin only endpoint - sadece ADMIN rolü erişebilir
     */
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> adminEndpoint(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(Map.of(
            "message", "Bu admin endpoint - sadece ADMIN rolü erişebilir",
            "user", jwt.getClaimAsString("preferred_username"),
            "status", "success"
        ));
    }

    /**
     * Veteriner endpoint - VETERINER ve ADMIN rolleri erişebilir
     */
    @GetMapping("/veteriner")
    @PreAuthorize("hasRole('VETERINER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> veterinerEndpoint(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(Map.of(
            "message", "Bu veteriner endpoint - VETERINER ve ADMIN rolleri erişebilir",
            "user", jwt.getClaimAsString("preferred_username"),
            "status", "success"
        ));
    }

    /**
     * User info endpoint - kullanıcı bilgilerini döner
     */
    @GetMapping("/userinfo")
    public ResponseEntity<Map<String, Object>> userInfo(@AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "JWT token bulunamadı",
                "status", "error"
            ));
        }
        
        try {
            return ResponseEntity.ok(Map.of(
                "username", jwt.getClaimAsString("preferred_username") != null ? 
                    jwt.getClaimAsString("preferred_username") : "N/A",
                "email", jwt.getClaimAsString("email") != null ? 
                    jwt.getClaimAsString("email") : "N/A",
                "firstName", jwt.getClaimAsString("given_name") != null ? 
                    jwt.getClaimAsString("given_name") : "N/A",
                "lastName", jwt.getClaimAsString("family_name") != null ? 
                    jwt.getClaimAsString("family_name") : "N/A",
                "roles", jwt.getClaimAsMap("realm_access") != null ? 
                    jwt.getClaimAsMap("realm_access") : Map.of(),
                "iss", jwt.getClaimAsString("iss") != null ? 
                    jwt.getClaimAsString("iss") : "N/A",
                "aud", jwt.getClaimAsStringList("aud") != null ? 
                    jwt.getClaimAsStringList("aud") : List.of(),
                "exp", jwt.getClaimAsInstant("exp") != null ? 
                    jwt.getClaimAsInstant("exp") : "N/A",
                "iat", jwt.getClaimAsInstant("iat") != null ? 
                    jwt.getClaimAsInstant("iat") : "N/A",
                "status", "success"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "JWT token işlenirken hata oluştu: " + e.getMessage(),
                "status", "error"
            ));
        }
    }
} 