package com.vetverse.hss.service;

import com.vetverse.hss.config.KeycloakAdminConfig;
import com.vetverse.hss.entity.Personel;
import com.vetverse.hss.entity.Rol;
import com.vetverse.hss.repository.PersonelRepository;
import com.vetverse.hss.repository.RolRepository;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * User Synchronization Service
 * Keycloak ve PostgreSQL arasında kullanıcı senkronizasyonu
 */
@Service
@Transactional
public class UserSyncService {

    private static final Logger logger = LoggerFactory.getLogger(UserSyncService.class);

    @Autowired
    private Keycloak keycloakAdmin;

    @Autowired
    private KeycloakAdminConfig keycloakConfig;

    @Autowired
    private PersonelRepository personelRepository;

    @Autowired
    private RolRepository rolRepository;

    /**
     * Keycloak'tan tüm kullanıcıları çekip PostgreSQL ile senkronize eder
     */
    public void syncAllUsers() {
        logger.info("Starting user synchronization from Keycloak...");
        
        try {
            RealmResource realmResource = keycloakAdmin.realm(keycloakConfig.getTargetRealm());
            UsersResource usersResource = realmResource.users();
            
            // Tüm kullanıcıları al
            List<UserRepresentation> keycloakUsers = usersResource.list();
            logger.info("Found {} users in Keycloak", keycloakUsers.size());
            
            int syncedCount = 0;
            int errorCount = 0;
            
            for (UserRepresentation keycloakUser : keycloakUsers) {
                try {
                    syncSingleUser(keycloakUser, realmResource);
                    syncedCount++;
                } catch (Exception e) {
                    logger.error("Error syncing user {}: {}", keycloakUser.getUsername(), e.getMessage());
                    errorCount++;
                }
            }
            
            logger.info("User synchronization completed. Synced: {}, Errors: {}", syncedCount, errorCount);
            
        } catch (Exception e) {
            logger.error("Failed to sync users from Keycloak", e);
            throw new RuntimeException("User synchronization failed", e);
        }
    }

    /**
     * Tek bir kullanıcıyı senkronize eder
     */
    public void syncSingleUser(UserRepresentation keycloakUser, RealmResource realmResource) {
        logger.debug("Syncing user: {}", keycloakUser.getUsername());
        
        // Mevcut personel kaydını kontrol et
        Optional<Personel> existingPersonel = personelRepository.findByKeycloakUserId(keycloakUser.getId());
        
        Personel personel;
        if (existingPersonel.isPresent()) {
            // Mevcut kaydı güncelle
            personel = existingPersonel.get();
            updatePersonelFromKeycloak(personel, keycloakUser);
        } else {
            // Yeni kayıt oluştur
            personel = createPersonelFromKeycloak(keycloakUser);
        }
        
        // Rolleri senkronize et
        syncUserRoles(personel, keycloakUser, realmResource);
        
        // Senkronizasyon zamanını güncelle
        personel.setSonSenkronizasyon(LocalDateTime.now());
        
        // Kaydet
        personelRepository.save(personel);
        
        logger.debug("User {} synchronized successfully", keycloakUser.getUsername());
    }

    /**
     * Keycloak kullanıcısından yeni Personel oluşturur
     */
    private Personel createPersonelFromKeycloak(UserRepresentation keycloakUser) {
        Personel personel = new Personel();
        
        // Temel bilgileri ayarla
        personel.setKeycloakUserId(keycloakUser.getId());
        personel.setEposta(keycloakUser.getEmail());
        personel.setAktif(keycloakUser.isEnabled());
        personel.setIseBaslamaTarihi(LocalDate.now());
        
        // Ad soyad oluştur
        String firstName = keycloakUser.getFirstName() != null ? keycloakUser.getFirstName() : "";
        String lastName = keycloakUser.getLastName() != null ? keycloakUser.getLastName() : "";
        String fullName = (firstName + " " + lastName).trim();
        
        if (fullName.isEmpty()) {
            fullName = keycloakUser.getUsername();
        }
        
        personel.setAdSoyad(fullName);
        
        return personel;
    }

    /**
     * Mevcut Personel'i Keycloak bilgileriyle günceller
     */
    private void updatePersonelFromKeycloak(Personel personel, UserRepresentation keycloakUser) {
        // Email güncelle
        if (keycloakUser.getEmail() != null) {
            personel.setEposta(keycloakUser.getEmail());
        }
        
        // Aktif durumu güncelle
        personel.setAktif(keycloakUser.isEnabled());
        
        // Ad soyad güncelle
        String firstName = keycloakUser.getFirstName() != null ? keycloakUser.getFirstName() : "";
        String lastName = keycloakUser.getLastName() != null ? keycloakUser.getLastName() : "";
        String fullName = (firstName + " " + lastName).trim();
        
        if (!fullName.isEmpty()) {
            personel.setAdSoyad(fullName);
        }
    }

    /**
     * Kullanıcının rollerini senkronize eder
     */
    private void syncUserRoles(Personel personel, UserRepresentation keycloakUser, RealmResource realmResource) {
        try {
            UserResource userResource = realmResource.users().get(keycloakUser.getId());
            List<RoleRepresentation> realmRoles = userResource.roles().realmLevel().listEffective();
            
            // Mevcut rolleri temizle
            personel.getRoller().clear();
            
            // Keycloak'tan gelen rolleri ekle
            for (RoleRepresentation roleRep : realmRoles) {
                String roleName = roleRep.getName();
                
                // Sistem rollerini filtrele (default_roles_* gibi)
                if (isSystemRole(roleName)) {
                    continue;
                }
                
                // Rol varsa ekle
                Optional<Rol> rol = rolRepository.findByAd(roleName);
                if (rol.isPresent()) {
                    personel.addRol(rol.get());
                    logger.debug("Added role {} to user {}", roleName, keycloakUser.getUsername());
                } else {
                    logger.warn("Role {} not found in database for user {}", roleName, keycloakUser.getUsername());
                }
            }
            
        } catch (Exception e) {
            logger.error("Error syncing roles for user {}: {}", keycloakUser.getUsername(), e.getMessage());
        }
    }

    /**
     * Sistem rollerini filtreler
     */
    private boolean isSystemRole(String roleName) {
        return roleName.startsWith("default-roles-") || 
               roleName.equals("offline_access") || 
               roleName.equals("uma_authorization");
    }

    /**
     * Belirli bir kullanıcıyı ID ile senkronize eder
     */
    public void syncUserById(String keycloakUserId) {
        logger.info("Syncing user by ID: {}", keycloakUserId);
        
        try {
            RealmResource realmResource = keycloakAdmin.realm(keycloakConfig.getTargetRealm());
            UserResource userResource = realmResource.users().get(keycloakUserId);
            UserRepresentation keycloakUser = userResource.toRepresentation();
            
            syncSingleUser(keycloakUser, realmResource);
            
        } catch (Exception e) {
            logger.error("Failed to sync user by ID: {}", keycloakUserId, e);
            throw new RuntimeException("User synchronization failed", e);
        }
    }

    /**
     * Keycloak'ta olmayan personelleri deaktif eder
     */
    public void deactivateRemovedUsers() {
        logger.info("Checking for removed users in Keycloak...");
        
        try {
            RealmResource realmResource = keycloakAdmin.realm(keycloakConfig.getTargetRealm());
            List<UserRepresentation> keycloakUsers = realmResource.users().list();
            
            Set<String> keycloakUserIds = keycloakUsers.stream()
                    .map(UserRepresentation::getId)
                    .collect(Collectors.toSet());
            
            // Keycloak'ta olmayan aktif personelleri bul
            List<Personel> allPersonel = personelRepository.findByAktifTrue();
            
            int deactivatedCount = 0;
            for (Personel personel : allPersonel) {
                if (personel.getKeycloakUserId() != null && 
                    !keycloakUserIds.contains(personel.getKeycloakUserId())) {
                    
                    personel.setAktif(false);
                    personelRepository.save(personel);
                    deactivatedCount++;
                    
                    logger.info("Deactivated user: {} (Keycloak ID: {})", 
                              personel.getAdSoyad(), personel.getKeycloakUserId());
                }
            }
            
            logger.info("Deactivated {} removed users", deactivatedCount);
            
        } catch (Exception e) {
            logger.error("Failed to check for removed users", e);
        }
    }

    /**
     * Senkronizasyon istatistiklerini döndürür
     */
    public SyncStats getSyncStats() {
        long totalPersonel = personelRepository.count();
        long syncedPersonel = personelRepository.findAll().stream()
                .filter(p -> p.getKeycloakUserId() != null)
                .count();
        long unsyncedPersonel = totalPersonel - syncedPersonel;
        
        return new SyncStats(totalPersonel, syncedPersonel, unsyncedPersonel);
    }

    /**
     * Senkronizasyon istatistikleri sınıfı
     */
    public static class SyncStats {
        private final long totalPersonel;
        private final long syncedPersonel;
        private final long unsyncedPersonel;

        public SyncStats(long totalPersonel, long syncedPersonel, long unsyncedPersonel) {
            this.totalPersonel = totalPersonel;
            this.syncedPersonel = syncedPersonel;
            this.unsyncedPersonel = unsyncedPersonel;
        }

        public long getTotalPersonel() { return totalPersonel; }
        public long getSyncedPersonel() { return syncedPersonel; }
        public long getUnsyncedPersonel() { return unsyncedPersonel; }
    }
} 