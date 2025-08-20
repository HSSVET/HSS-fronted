package com.vetverse.hss.controller;

import com.vetverse.hss.entity.Personel;
import com.vetverse.hss.repository.PersonelRepository;
import com.vetverse.hss.service.UserSyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * User Management Controller
 * Kullanıcı yönetimi ve senkronizasyon API'leri
 */
@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserManagementController {

    @Autowired
    private UserSyncService userSyncService;

    @Autowired
    private PersonelRepository personelRepository;

    /**
     * Tüm personelleri listele
     */
    @GetMapping
    public ResponseEntity<List<Personel>> getAllPersonel() {
        List<Personel> personeller = personelRepository.findAll();
        return ResponseEntity.ok(personeller);
    }

    /**
     * Aktif personelleri listele
     */
    @GetMapping("/active")
    public ResponseEntity<List<Personel>> getActivePersonel() {
        List<Personel> personeller = personelRepository.findByAktifTrue();
        return ResponseEntity.ok(personeller);
    }

    /**
     * Belirli bir personeli getir
     */
    @GetMapping("/{id}")
    public ResponseEntity<Personel> getPersonelById(@PathVariable Long id) {
        Optional<Personel> personel = personelRepository.findById(id);
        return personel.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Email ile personel ara
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<Personel> getPersonelByEmail(@PathVariable String email) {
        Optional<Personel> personel = personelRepository.findByEposta(email);
        return personel.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Belirli role sahip personelleri listele
     */
    @GetMapping("/role/{roleName}")
    public ResponseEntity<List<Personel>> getPersonelByRole(@PathVariable String roleName) {
        List<Personel> personeller = personelRepository.findByRoleName(roleName);
        return ResponseEntity.ok(personeller);
    }

    /**
     * Personel ara (ad soyad ile)
     */
    @GetMapping("/search")
    public ResponseEntity<List<Personel>> searchPersonel(@RequestParam String query) {
        List<Personel> personeller = personelRepository.searchByAdSoyad(query);
        return ResponseEntity.ok(personeller);
    }

    /**
     * Manuel tam senkronizasyon başlat
     */
    @PostMapping("/sync/full")
    public ResponseEntity<Map<String, Object>> syncAllUsers() {
        try {
            userSyncService.syncAllUsers();
            
            UserSyncService.SyncStats stats = userSyncService.getSyncStats();
            
            return ResponseEntity.ok(Map.of(
                "message", "Tam senkronizasyon başarıyla tamamlandı",
                "status", "success",
                "stats", Map.of(
                    "total", stats.getTotalPersonel(),
                    "synced", stats.getSyncedPersonel(),
                    "unsynced", stats.getUnsyncedPersonel()
                )
            ));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "message", "Senkronizasyon sırasında hata oluştu: " + e.getMessage(),
                "status", "error"
            ));
        }
    }

    /**
     * Belirli bir kullanıcıyı senkronize et
     */
    @PostMapping("/sync/user/{keycloakUserId}")
    public ResponseEntity<Map<String, Object>> syncUserById(@PathVariable String keycloakUserId) {
        try {
            userSyncService.syncUserById(keycloakUserId);
            
            return ResponseEntity.ok(Map.of(
                "message", "Kullanıcı başarıyla senkronize edildi",
                "status", "success",
                "keycloakUserId", keycloakUserId
            ));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "message", "Kullanıcı senkronizasyonu sırasında hata oluştu: " + e.getMessage(),
                "status", "error",
                "keycloakUserId", keycloakUserId
            ));
        }
    }

    /**
     * Silinen kullanıcıları kontrol et ve deaktif et
     */
    @PostMapping("/sync/cleanup")
    public ResponseEntity<Map<String, Object>> cleanupRemovedUsers() {
        try {
            userSyncService.deactivateRemovedUsers();
            
            return ResponseEntity.ok(Map.of(
                "message", "Silinen kullanıcılar başarıyla temizlendi",
                "status", "success"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "message", "Kullanıcı temizleme sırasında hata oluştu: " + e.getMessage(),
                "status", "error"
            ));
        }
    }

    /**
     * Senkronizasyon istatistiklerini getir
     */
    @GetMapping("/sync/stats")
    public ResponseEntity<Map<String, Object>> getSyncStats() {
        try {
            UserSyncService.SyncStats stats = userSyncService.getSyncStats();
            
            return ResponseEntity.ok(Map.of(
                "totalPersonel", stats.getTotalPersonel(),
                "syncedPersonel", stats.getSyncedPersonel(),
                "unsyncedPersonel", stats.getUnsyncedPersonel(),
                "syncPercentage", stats.getTotalPersonel() > 0 ? 
                    (double) stats.getSyncedPersonel() / stats.getTotalPersonel() * 100 : 0,
                "status", "success"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "message", "İstatistik alınırken hata oluştu: " + e.getMessage(),
                "status", "error"
            ));
        }
    }

    /**
     * Personel durumunu güncelle (aktif/pasif)
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updatePersonelStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, Boolean> request) {
        
        try {
            Optional<Personel> personelOpt = personelRepository.findById(id);
            
            if (personelOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Personel personel = personelOpt.get();
            Boolean aktif = request.get("aktif");
            
            if (aktif != null) {
                personel.setAktif(aktif);
                personelRepository.save(personel);
                
                return ResponseEntity.ok(Map.of(
                    "message", "Personel durumu güncellendi",
                    "status", "success",
                    "personel", Map.of(
                        "id", personel.getId(),
                        "adSoyad", personel.getAdSoyad(),
                        "aktif", personel.getAktif()
                    )
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "message", "Aktif durumu belirtilmedi",
                    "status", "error"
                ));
            }
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "message", "Personel durumu güncellenirken hata oluştu: " + e.getMessage(),
                "status", "error"
            ));
        }
    }

    /**
     * Senkronize edilmemiş personelleri listele
     */
    @GetMapping("/unsynced")
    public ResponseEntity<List<Personel>> getUnsyncedPersonel() {
        List<Personel> unsyncedPersonel = personelRepository.findPersonelWithoutKeycloakId();
        return ResponseEntity.ok(unsyncedPersonel);
    }
} 