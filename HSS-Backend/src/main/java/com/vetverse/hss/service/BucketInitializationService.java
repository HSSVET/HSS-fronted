package com.vetverse.hss.service;

import com.vetverse.hss.config.MinioConfig;
import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Uygulama başlatıldığında gerekli bucket'ları oluşturan servis
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class BucketInitializationService implements CommandLineRunner {

    private final MinioClient minioClient;
    private final MinioConfig.MinioProperties minioProperties;

    @Override
    public void run(String... args) throws Exception {
        log.info("MinIO bucket'ları kontrol ediliyor ve oluşturuluyor...");
        
        Map<String, String> buckets = minioProperties.getBuckets();
        
        for (Map.Entry<String, String> entry : buckets.entrySet()) {
            String bucketType = entry.getKey();
            String bucketName = entry.getValue();
            
            try {
                // Bucket var mı kontrol et
                boolean exists = minioClient.bucketExists(
                    BucketExistsArgs.builder().bucket(bucketName).build()
                );
                
                if (!exists) {
                    // Bucket oluştur
                    minioClient.makeBucket(
                        MakeBucketArgs.builder().bucket(bucketName).build()
                    );
                    log.info("Bucket oluşturuldu: {} ({})", bucketName, bucketType);
                } else {
                    log.info("Bucket zaten mevcut: {} ({})", bucketName, bucketType);
                }
                
            } catch (Exception e) {
                log.error("Bucket oluşturma hatası: {} - {}", bucketName, e.getMessage(), e);
                // Uygulama başlatmayı durdurmamak için exception'ı yeniden fırlatmıyoruz
            }
        }
        
        log.info("MinIO bucket inizalizasyonu tamamlandı.");
    }
}