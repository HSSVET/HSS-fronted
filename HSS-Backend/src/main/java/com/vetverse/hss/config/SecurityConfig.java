package com.vetverse.hss.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * HSS (Hayvan Sağlığı Sistemi) Security Configuration
 * Keycloak OAuth2 JWT tabanlı kimlik doğrulama ve yetkilendirme
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri:http://localhost:8080/realms/veterinary-clinic}")
    private String issuerUri;

    /**
     * JWT Decoder Bean - Keycloak realm'dan JWT token'ları doğrular
     */
    @Bean
    public JwtDecoder jwtDecoder() {
        return JwtDecoders.fromIssuerLocation(issuerUri);
    }

    /**
     * JWT Authentication Converter - JWT'den Spring Security yetkileri oluşturur
     */
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        
        // Realm rolleri için converter
        JwtGrantedAuthoritiesConverter realmRolesConverter = new JwtGrantedAuthoritiesConverter();
        realmRolesConverter.setAuthorityPrefix("ROLE_");
        realmRolesConverter.setAuthoritiesClaimName("realm_access.roles");
        
        // Custom authorities converter - hem realm hem resource rolleri
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Collection<SimpleGrantedAuthority> authorities = 
                realmRolesConverter.convert(jwt).stream()
                    .map(authority -> new SimpleGrantedAuthority(authority.getAuthority()))
                    .collect(Collectors.toList());
            
            // Realm access rollerini ekle
            Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
            if (realmAccess != null && realmAccess.containsKey("roles")) {
                List<String> realmRoles = (List<String>) realmAccess.get("roles");
                for (String role : realmRoles) {
                    authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
                }
            }
            
            return (Collection) authorities;
        });
        
        return converter;
    }

    /**
     * CORS Configuration - Frontend React app'in backend'e erişimi için
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("http://localhost:3000", "http://127.0.0.1:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Security Filter Chain - HTTP güvenlik konfigürasyonu
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CSRF korumasını devre dışı bırak (JWT kullandığımız için)
            .csrf(AbstractHttpConfigurer::disable)
            
            // CORS konfigürasyonunu etkinleştir
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Session management - Stateless JWT authentication
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // HTTP istekleri için yetki kuralları
            .authorizeHttpRequests(auth -> auth
                // Health check endpoints - kimlik doğrulama gerektirmez
                .requestMatchers("/actuator/**", "/health", "/info").permitAll()
                
                // API documentation - kimlik doğrulama gerektirmez
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                
                // Test endpoint - kimlik doğrulama gerektirmez
                .requestMatchers("/api/test/public").permitAll()
                
                // Reminder test endpoints - kimlik doğrulama gerektirmez (geliştirme için)
                .requestMatchers("/api/reminders/system-status", "/api/reminders/test", "/api/reminders/**").permitAll()
                
                // Admin endpoints - sadece ADMIN rolü
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/**").hasAnyRole("ADMIN", "VETERINER")
                
                // Veteriner endpoints - VETERINER ve ADMIN rolleri
                .requestMatchers("/api/animals/**", "/api/appointments/**").hasAnyRole("VETERINER", "ADMIN", "SEKRETER")
                .requestMatchers("/api/medical/**", "/api/prescriptions/**").hasAnyRole("VETERINER", "ADMIN")
                
                // Sekreter endpoints - SEKRETER, VETERINER ve ADMIN rolleri
                .requestMatchers("/api/billing/**", "/api/clients/**").hasAnyRole("SEKRETER", "VETERINER", "ADMIN")
                
                // Laboratory endpoints - TEKNISYEN, VETERINER ve ADMIN rolleri
                .requestMatchers("/api/lab/**").hasAnyRole("TEKNISYEN", "VETERINER", "ADMIN")
                
                // Diğer tüm API endpoints - kimlik doğrulama gerektirir
                .requestMatchers("/api/**").authenticated()
                
                // Diğer istekler için varsayılan davranış
                .anyRequest().authenticated()
            )
            
            // OAuth2 Resource Server (JWT) konfigürasyonu
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .decoder(jwtDecoder())
                    .jwtAuthenticationConverter(jwtAuthenticationConverter())
                )
            );

        return http.build();
    }
} 