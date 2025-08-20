package com.vetverse.hss.config;

import io.minio.MinioClient;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * MinIO yapılandırma sınıfı
 * MinIO Client bean'ini oluşturur ve uygulama özelliklerini yönetir
 */
@Configuration
public class MinioConfig {

    private final MinioProperties minioProperties;

    public MinioConfig(MinioProperties minioProperties) {
        this.minioProperties = minioProperties;
    }

    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(minioProperties.getEndpoint())
                .credentials(minioProperties.getAccessKey(), minioProperties.getSecretKey())
                .build();
    }

    /**
     * MinIO özelliklerini tutan yapılandırma sınıfı
     */
    @Data
    @Component
    @ConfigurationProperties(prefix = "hss.storage.minio")
    public static class MinioProperties {
        private String endpoint;
        private String accessKey;
        private String secretKey;
        private Map<String, String> buckets;
        private String maxFileSize = "10MB";
    }
}