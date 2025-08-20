package com.vetverse.hss.controller;

import com.vetverse.hss.dto.ClinicalExaminationDto;
import com.vetverse.hss.service.ClinicalExaminationService;
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
 * ClinicalExamination Controller
 * ClinicalExamination API endpoints
 */
@RestController
@RequestMapping("/api/clinical-examinations")
@PreAuthorize("hasAnyRole('VETERINER', 'ADMIN', 'SEKRETER')")
public class ClinicalExaminationController {

    @Autowired
    private ClinicalExaminationService clinicalExaminationService;

    /**
     * Tüm klinik muayeneleri listeleme
     */
    @GetMapping
    public ResponseEntity<List<ClinicalExaminationDto.Response>> getAllClinicalExaminations() {
        List<ClinicalExaminationDto.Response> examinations = clinicalExaminationService.getAllClinicalExaminations();
        return ResponseEntity.ok(examinations);
    }

    /**
     * Sayfalanmış klinik muayene listesi
     */
    @GetMapping("/paged")
    public ResponseEntity<Page<ClinicalExaminationDto.Response>> getAllClinicalExaminationsPaged(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ClinicalExaminationDto.Response> examinations = clinicalExaminationService.getAllClinicalExaminations(pageable);
        return ResponseEntity.ok(examinations);
    }

    /**
     * ID'ye göre klinik muayene bulma
     */
    @GetMapping("/{id}")
    public ResponseEntity<ClinicalExaminationDto.Response> getClinicalExaminationById(@PathVariable Long id) {
        return clinicalExaminationService.getClinicalExaminationById(id)
                .map(examination -> ResponseEntity.ok(examination))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Hayvan ID'sine göre klinik muayeneleri listeleme
     */
    @GetMapping("/animal/{animalId}")
    public ResponseEntity<List<ClinicalExaminationDto.Response>> getClinicalExaminationsByAnimalId(@PathVariable Long animalId) {
        List<ClinicalExaminationDto.Response> examinations = clinicalExaminationService.getClinicalExaminationsByAnimalId(animalId);
        return ResponseEntity.ok(examinations);
    }

    /**
     * Sahip ID'sine göre klinik muayeneleri listeleme
     */
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<ClinicalExaminationDto.Response>> getClinicalExaminationsByOwnerId(@PathVariable Long ownerId) {
        List<ClinicalExaminationDto.Response> examinations = clinicalExaminationService.getClinicalExaminationsByOwnerId(ownerId);
        return ResponseEntity.ok(examinations);
    }

    /**
     * Veteriner adına göre klinik muayeneleri listeleme
     */
    @GetMapping("/veterinarian/{veterinarianName}")
    public ResponseEntity<List<ClinicalExaminationDto.Response>> getClinicalExaminationsByVeterinarianName(@PathVariable String veterinarianName) {
        List<ClinicalExaminationDto.Response> examinations = clinicalExaminationService.getClinicalExaminationsByVeterinarianName(veterinarianName);
        return ResponseEntity.ok(examinations);
    }

    /**
     * Tür ID'sine göre klinik muayeneleri listeleme
     */
    @GetMapping("/species/{speciesId}")
    public ResponseEntity<List<ClinicalExaminationDto.Response>> getClinicalExaminationsBySpeciesId(@PathVariable Long speciesId) {
        List<ClinicalExaminationDto.Response> examinations = clinicalExaminationService.getClinicalExaminationsBySpeciesId(speciesId);
        return ResponseEntity.ok(examinations);
    }

    /**
     * Irk ID'sine göre klinik muayeneleri listeleme
     */
    @GetMapping("/breed/{breedId}")
    public ResponseEntity<List<ClinicalExaminationDto.Response>> getClinicalExaminationsByBreedId(@PathVariable Long breedId) {
        List<ClinicalExaminationDto.Response> examinations = clinicalExaminationService.getClinicalExaminationsByBreedId(breedId);
        return ResponseEntity.ok(examinations);
    }

    /**
     * Tarih aralığına göre klinik muayeneleri listeleme
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<ClinicalExaminationDto.Response>> getClinicalExaminationsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<ClinicalExaminationDto.Response> examinations = clinicalExaminationService.getClinicalExaminationsByDateRange(startDate, endDate);
        return ResponseEntity.ok(examinations);
    }

    /**
     * Belirli tarihteki muayeneleri listeleme
     */
    @GetMapping("/date/{date}")
    public ResponseEntity<List<ClinicalExaminationDto.Response>> getClinicalExaminationsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<ClinicalExaminationDto.Response> examinations = clinicalExaminationService.getClinicalExaminationsByDate(date);
        return ResponseEntity.ok(examinations);
    }

    /**
     * Bugünkü klinik muayeneleri listeleme
     */
    @GetMapping("/today")
    public ResponseEntity<List<ClinicalExaminationDto.Response>> getTodayExaminations() {
        List<ClinicalExaminationDto.Response> examinations = clinicalExaminationService.getTodayExaminations();
        return ResponseEntity.ok(examinations);
    }

    /**
     * Son 7 günde yapılan muayeneler
     */
    @GetMapping("/recent")
    public ResponseEntity<List<ClinicalExaminationDto.Response>> getRecentExaminations() {
        List<ClinicalExaminationDto.Response> examinations = clinicalExaminationService.getRecentExaminations();
        return ResponseEntity.ok(examinations);
    }

    /**
     * Bulgular ile klinik muayene arama
     */
    @GetMapping("/search/findings")
    public ResponseEntity<List<ClinicalExaminationDto.Response>> searchClinicalExaminationsByFindings(@RequestParam String findings) {
        List<ClinicalExaminationDto.Response> examinations = clinicalExaminationService.searchClinicalExaminationsByFindings(findings);
        return ResponseEntity.ok(examinations);
    }

    /**
     * Veteriner adı ile klinik muayene arama
     */
    @GetMapping("/search/veterinarian")
    public ResponseEntity<List<ClinicalExaminationDto.Response>> searchClinicalExaminationsByVeterinarianName(@RequestParam String veterinarianName) {
        List<ClinicalExaminationDto.Response> examinations = clinicalExaminationService.searchClinicalExaminationsByVeterinarianName(veterinarianName);
        return ResponseEntity.ok(examinations);
    }

    /**
     * Hayvan adı ile klinik muayene arama
     */
    @GetMapping("/search/animal")
    public ResponseEntity<List<ClinicalExaminationDto.Response>> searchClinicalExaminationsByAnimalName(@RequestParam String animalName) {
        List<ClinicalExaminationDto.Response> examinations = clinicalExaminationService.searchClinicalExaminationsByAnimalName(animalName);
        return ResponseEntity.ok(examinations);
    }

    /**
     * Sahip adı ile klinik muayene arama
     */
    @GetMapping("/search/owner")
    public ResponseEntity<List<ClinicalExaminationDto.Response>> searchClinicalExaminationsByOwnerName(@RequestParam String ownerName) {
        List<ClinicalExaminationDto.Response> examinations = clinicalExaminationService.searchClinicalExaminationsByOwnerName(ownerName);
        return ResponseEntity.ok(examinations);
    }

    /**
     * Veteriner ve tarih aralığına göre muayeneleri listeleme
     */
    @GetMapping("/veterinarian-date-range")
    public ResponseEntity<List<ClinicalExaminationDto.Response>> getClinicalExaminationsByVeterinarianAndDateRange(
            @RequestParam String veterinarianName,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<ClinicalExaminationDto.Response> examinations = 
            clinicalExaminationService.getClinicalExaminationsByVeterinarianAndDateRange(veterinarianName, startDate, endDate);
        return ResponseEntity.ok(examinations);
    }

    /**
     * Veteriner bazında muayene istatistikleri
     */
    @GetMapping("/statistics/veterinarian")
    public ResponseEntity<List<ClinicalExaminationDto.ExaminationStatistics>> getVeterinarianExaminationStatistics() {
        List<ClinicalExaminationDto.ExaminationStatistics> statistics = clinicalExaminationService.getVeterinarianExaminationStatistics();
        return ResponseEntity.ok(statistics);
    }

    /**
     * Dropdown için basit klinik muayene listesi
     */
    @GetMapping("/basic")
    public ResponseEntity<List<ClinicalExaminationDto.Basic>> getBasicClinicalExaminationsList() {
        List<ClinicalExaminationDto.Basic> examinations = clinicalExaminationService.getBasicClinicalExaminationsList();
        return ResponseEntity.ok(examinations);
    }

    /**
     * Yeni klinik muayene oluşturma
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('VETERINER', 'ADMIN')")
    public ResponseEntity<ClinicalExaminationDto.Response> createClinicalExamination(@Valid @RequestBody ClinicalExaminationDto.Request request) {
        try {
            ClinicalExaminationDto.Response examination = clinicalExaminationService.createClinicalExamination(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(examination);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Klinik muayene güncelleme
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('VETERINER', 'ADMIN')")
    public ResponseEntity<ClinicalExaminationDto.Response> updateClinicalExamination(
            @PathVariable Long id, 
            @Valid @RequestBody ClinicalExaminationDto.Request request) {
        try {
            ClinicalExaminationDto.Response examination = clinicalExaminationService.updateClinicalExamination(id, request);
            return ResponseEntity.ok(examination);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Klinik muayene silme
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VETERINER')")
    public ResponseEntity<Map<String, String>> deleteClinicalExamination(@PathVariable Long id) {
        try {
            clinicalExaminationService.deleteClinicalExamination(id);
            return ResponseEntity.ok(Map.of(
                "message", "Clinical examination deleted successfully",
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