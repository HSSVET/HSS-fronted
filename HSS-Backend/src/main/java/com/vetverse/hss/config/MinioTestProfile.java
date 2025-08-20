package com.vetverse.hss.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;

/**
 * MinIO test konfigürasyonu
 * Problemli servisleri devre dışı bırakarak MinIO testi yapar
 */
@Configuration
@ConditionalOnProperty(name = "hss.minio.test-mode", havingValue = "true", matchIfMissing = false)
@ComponentScan(
    basePackages = "com.vetverse.hss",
    excludeFilters = {
        @ComponentScan.Filter(type = FilterType.REGEX, pattern = "com\\.vetverse\\.hss\\.service\\..*Service"),
        @ComponentScan.Filter(type = FilterType.REGEX, pattern = "com\\.vetverse\\.hss\\.repository\\..*Repository")
    },
    includeFilters = {
        @ComponentScan.Filter(type = FilterType.REGEX, pattern = "com\\.vetverse\\.hss\\.service\\.FileStorageService"),
        @ComponentScan.Filter(type = FilterType.REGEX, pattern = "com\\.vetverse\\.hss\\.service\\.BucketInitializationService"),
        @ComponentScan.Filter(type = FilterType.REGEX, pattern = "com\\.vetverse\\.hss\\.repository\\.FileMetadataRepository"),
        @ComponentScan.Filter(type = FilterType.REGEX, pattern = "com\\.vetverse\\.hss\\.controller\\.FileController")
    }
)
public class MinioTestProfile {
}