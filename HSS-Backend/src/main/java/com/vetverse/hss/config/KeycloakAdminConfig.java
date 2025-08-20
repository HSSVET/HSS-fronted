package com.vetverse.hss.config;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Keycloak Admin API Configuration
 * Kullanıcı yönetimi ve senkronizasyon için
 */
@Configuration
public class KeycloakAdminConfig {

    @Value("${hss.keycloak.server-url}")
    private String serverUrl;

    @Value("${hss.keycloak.realm}")
    private String realm;

    @Value("${hss.keycloak.admin.username:admin}")
    private String adminUsername;

    @Value("${hss.keycloak.admin.password:admin123}")
    private String adminPassword;

    @Value("${hss.keycloak.admin.client-id:admin-cli}")
    private String adminClientId;

    /**
     * Keycloak Admin Client Bean
     * Kullanıcı yönetimi ve senkronizasyon işlemleri için
     */
    @Bean
    public Keycloak keycloakAdmin() {
        return KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm("master") // Admin işlemleri için master realm
                .username(adminUsername)
                .password(adminPassword)
                .clientId(adminClientId)
                .build();
    }

    /**
     * Target realm name getter
     */
    public String getTargetRealm() {
        return realm;
    }
} 