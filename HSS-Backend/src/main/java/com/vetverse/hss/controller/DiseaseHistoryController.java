package com.vetverse.hss.controller;

import com.vetverse.hss.dto.DiseaseHistoryDto;
import com.vetverse.hss.service.DiseaseHistoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * DiseaseHistory Controller
 * DiseaseHistory API endpoints
 */
@RestController
@RequestMapping("/api/disease-histories")
@PreAuthorize("hasAnyRole('VETERINER', 'ADMIN', 'SEKRETER')")
public class DiseaseHistoryController {

    @Autowired
    private DiseaseHistoryService diseaseHistoryService;

    /**
     * Tüm hastalık geçmişlerini listeleme
     */
    @GetMapping
    public ResponseEntity<List<DiseaseHistoryDto.Response>> getAllDiseaseHistories() {
        List<DiseaseHistoryDto.Response> diseaseHistories = diseaseHistoryService.getAllDiseaseHistories();
        return ResponseEntity.ok(diseaseHistories);
    }

    /**
     * Sayfalanmış hastalık geçmişi listesi
     */
    @GetMapping("/paged")
    public ResponseEntity<Page<DiseaseHistoryDto.Response>> getAllDiseaseHistoriesPaged(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<DiseaseHistoryDto.Response> diseaseHistories = diseaseHistoryService.getAllDiseaseHistories(pageable);
        return ResponseEntity.ok(diseaseHistories);
    }

    /**
     * ID'ye göre hastalık geçmişi bulma
     */
    @GetMapping("/{id}")
    public ResponseEntity<DiseaseHistoryDto.Response> getDiseaseHistoryById(@PathVariable Long id) {
        return diseaseHistoryService.getDiseaseHistoryById(id)
                .map(diseaseHistory -> ResponseEntity.ok(diseaseHistory))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Hayvan ID'sine göre hastalık geçmişlerini listeleme
     */
    @GetMapping("/animal/{animalId}")
    public ResponseEntity<List<DiseaseHistoryDto.Response>> getDiseaseHistoriesByAnimalId(@PathVariable Long animalId) {
        List<DiseaseHistoryDto.Response> diseaseHistories = diseaseHistoryService.getDiseaseHistoriesByAnimalId(animalId);
        return ResponseEntity.ok(diseaseHistories);
    }

    /**
     * Sahip ID'sine göre hastalık geçmişlerini listeleme
     */
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<DiseaseHistoryDto.Response>> getDiseaseHistoriesByOwnerId(@PathVariable Long ownerId) {
        List<DiseaseHistoryDto.Response> diseaseHistories = diseaseHistoryService.getDiseaseHistoriesByOwnerId(ownerId);
        return ResponseEntity.ok(diseaseHistories);
    }

    /**
     * Tür ID'sine göre hastalık geçmişlerini listeleme
     */
    @GetMapping("/species/{speciesId}")
    public ResponseEntity<List<DiseaseHistoryDto.Response>> getDiseaseHistoriesBySpeciesId(@PathVariable Long speciesId) {
        List<DiseaseHistoryDto.Response> diseaseHistories = diseaseHistoryService.getDiseaseHistoriesBySpeciesId(speciesId);
        return ResponseEntity.ok(diseaseHistories);
    }

    /**
     * Irk ID'sine göre hastalık geçmişlerini listeleme
     */
    @GetMapping("/breed/{breedId}")
    public ResponseEntity<List<DiseaseHistoryDto.Response>> getDiseaseHistoriesByBreedId(@PathVariable Long breedId) {
        List<DiseaseHistoryDto.Response> diseaseHistories = diseaseHistoryService.getDiseaseHistoriesByBreedId(breedId);
        return ResponseEntity.ok(diseaseHistories);
    }

    /**
     * Tarih aralığına göre hastalık geçmişlerini listeleme
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<DiseaseHistoryDto.Response>> getDiseaseHistoriesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<DiseaseHistoryDto.Response> diseaseHistories = diseaseHistoryService.getDiseaseHistoriesByDateRange(startDate, endDate);
        return ResponseEntity.ok(diseaseHistories);
    }

    /**
     * Son 30 günde eklenen hastalık kayıtları
     */
    @GetMapping("/recent")
    public ResponseEntity<List<DiseaseHistoryDto.Response>> getRecentDiseaseHistories() {
        List<DiseaseHistoryDto.Response> diseaseHistories = diseaseHistoryService.getRecentDiseaseHistories();
        return ResponseEntity.ok(diseaseHistories);
    }

    /**
     * Tanı ile hastalık geçmişi arama
     */
    @GetMapping("/search/diagnosis")
    public ResponseEntity<List<DiseaseHistoryDto.Response>> searchDiseaseHistoriesByDiagnosis(@RequestParam String diagnosis) {
        List<DiseaseHistoryDto.Response> diseaseHistories = diseaseHistoryService.searchDiseaseHistoriesByDiagnosis(diagnosis);
        return ResponseEntity.ok(diseaseHistories);
    }

    /**
     * Tedavi ile hastalık geçmişi arama
     */
    @GetMapping("/search/treatment")
    public ResponseEntity<List<DiseaseHistoryDto.Response>> searchDiseaseHistoriesByTreatment(@RequestParam String treatment) {
        List<DiseaseHistoryDto.Response> diseaseHistories = diseaseHistoryService.searchDiseaseHistoriesByTreatment(treatment);
        return ResponseEntity.ok(diseaseHistories);
    }

    /**
     * Hayvan adı ile hastalık geçmişi arama
     */
    @GetMapping("/search/animal")
    public ResponseEntity<List<DiseaseHistoryDto.Response>> searchDiseaseHistoriesByAnimalName(@RequestParam String animalName) {
        List<DiseaseHistoryDto.Response> diseaseHistories = diseaseHistoryService.searchDiseaseHistoriesByAnimalName(animalName);
        return ResponseEntity.ok(diseaseHistories);
    }

    /**
     * Sahip adı ile hastalık geçmişi arama
     */
    @GetMapping("/search/owner")
    public ResponseEntity<List<DiseaseHistoryDto.Response>> searchDiseaseHistoriesByOwnerName(@RequestParam String ownerName) {
        List<DiseaseHistoryDto.Response> diseaseHistories = diseaseHistoryService.searchDiseaseHistoriesByOwnerName(ownerName);
        return ResponseEntity.ok(diseaseHistories);
    }

    /**
     * Hastalık istatistikleri
     */
    @GetMapping("/statistics/diagnosis")
    public ResponseEntity<List<DiseaseHistoryDto.DiagnosisStatistics>> getDiagnosisStatistics() {
        List<DiseaseHistoryDto.DiagnosisStatistics> statistics = diseaseHistoryService.getDiagnosisStatistics();
        return ResponseEntity.ok(statistics);
    }

    /**
     * Dropdown için basit hastalık geçmişi listesi
     */
    @GetMapping("/basic")
    public ResponseEntity<List<DiseaseHistoryDto.Basic>> getBasicDiseaseHistoriesList() {
        List<DiseaseHistoryDto.Basic> diseaseHistories = diseaseHistoryService.getBasicDiseaseHistoriesList();
        return ResponseEntity.ok(diseaseHistories);
    }

    /**
     * Yeni hastalık geçmişi oluşturma
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('VETERINER', 'ADMIN')")
    public ResponseEntity<DiseaseHistoryDto.Response> createDiseaseHistory(@Valid @RequestBody DiseaseHistoryDto.Request request) {
        try {
            DiseaseHistoryDto.Response diseaseHistory = diseaseHistoryService.createDiseaseHistory(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(diseaseHistory);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Hastalık geçmişi güncelleme
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('VETERINER', 'ADMIN')")
    public ResponseEntity<DiseaseHistoryDto.Response> updateDiseaseHistory(
            @PathVariable Long id, 
            @Valid @RequestBody DiseaseHistoryDto.Request request) {
        try {
            DiseaseHistoryDto.Response diseaseHistory = diseaseHistoryService.updateDiseaseHistory(id, request);
            return ResponseEntity.ok(diseaseHistory);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Hastalık geçmişi silme
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VETERINER')")
    public ResponseEntity<Map<String, String>> deleteDiseaseHistory(@PathVariable Long id) {
        try {
            diseaseHistoryService.deleteDiseaseHistory(id);
            return ResponseEntity.ok(Map.of(
                "message", "Disease history deleted successfully",
                "status", "success"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", e.getMessage(),
                "status", "error"
            ));
        }
    }
} 