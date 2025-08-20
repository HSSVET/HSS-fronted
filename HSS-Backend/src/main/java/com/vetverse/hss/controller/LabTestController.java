package com.vetverse.hss.controller;

import com.vetverse.hss.dto.LabTestDto;
import com.vetverse.hss.service.LabTestService;
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
 * LabTest Controller
 * LabTest API endpoints
 */
@RestController
@RequestMapping("/api/lab-tests")
@PreAuthorize("hasAnyRole('VETERINER', 'ADMIN', 'SEKRETER', 'TEKNISYEN')")
public class LabTestController {

    @Autowired
    private LabTestService labTestService;

    /**
     * Tüm lab testlerini listeleme
     */
    @GetMapping
    public ResponseEntity<List<LabTestDto.Response>> getAllLabTests() {
        List<LabTestDto.Response> labTests = labTestService.getAllLabTests();
        return ResponseEntity.ok(labTests);
    }

    /**
     * Sayfalanmış lab test listesi
     */
    @GetMapping("/paged")
    public ResponseEntity<Page<LabTestDto.Response>> getAllLabTestsPaged(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<LabTestDto.Response> labTests = labTestService.getAllLabTests(pageable);
        return ResponseEntity.ok(labTests);
    }

    /**
     * ID'ye göre lab test bulma
     */
    @GetMapping("/{id}")
    public ResponseEntity<LabTestDto.Response> getLabTestById(@PathVariable Long id) {
        return labTestService.getLabTestById(id)
                .map(labTest -> ResponseEntity.ok(labTest))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Hayvan ID'sine göre lab testlerini listeleme
     */
    @GetMapping("/animal/{animalId}")
    public ResponseEntity<List<LabTestDto.Response>> getLabTestsByAnimalId(@PathVariable Long animalId) {
        List<LabTestDto.Response> labTests = labTestService.getLabTestsByAnimalId(animalId);
        return ResponseEntity.ok(labTests);
    }

    /**
     * Test adına göre lab testlerini listeleme
     */
    @GetMapping("/test-name/{testName}")
    public ResponseEntity<List<LabTestDto.Response>> getLabTestsByTestName(@PathVariable String testName) {
        List<LabTestDto.Response> labTests = labTestService.getLabTestsByTestName(testName);
        return ResponseEntity.ok(labTests);
    }

    /**
     * Sahip ID'sine göre lab testlerini listeleme
     */
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<LabTestDto.Response>> getLabTestsByOwnerId(@PathVariable Long ownerId) {
        List<LabTestDto.Response> labTests = labTestService.getLabTestsByOwnerId(ownerId);
        return ResponseEntity.ok(labTests);
    }

    /**
     * Tür ID'sine göre lab testlerini listeleme
     */
    @GetMapping("/species/{speciesId}")
    public ResponseEntity<List<LabTestDto.Response>> getLabTestsBySpeciesId(@PathVariable Long speciesId) {
        List<LabTestDto.Response> labTests = labTestService.getLabTestsBySpeciesId(speciesId);
        return ResponseEntity.ok(labTests);
    }

    /**
     * Irk ID'sine göre lab testlerini listeleme
     */
    @GetMapping("/breed/{breedId}")
    public ResponseEntity<List<LabTestDto.Response>> getLabTestsByBreedId(@PathVariable Long breedId) {
        List<LabTestDto.Response> labTests = labTestService.getLabTestsByBreedId(breedId);
        return ResponseEntity.ok(labTests);
    }

    /**
     * Tarih aralığına göre lab testlerini listeleme
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<LabTestDto.Response>> getLabTestsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<LabTestDto.Response> labTests = labTestService.getLabTestsByDateRange(startDate, endDate);
        return ResponseEntity.ok(labTests);
    }

    /**
     * Belirli tarihteki testleri listeleme
     */
    @GetMapping("/date/{date}")
    public ResponseEntity<List<LabTestDto.Response>> getLabTestsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<LabTestDto.Response> labTests = labTestService.getLabTestsByDate(date);
        return ResponseEntity.ok(labTests);
    }

    /**
     * Bugünkü lab testlerini listeleme
     */
    @GetMapping("/today")
    public ResponseEntity<List<LabTestDto.Response>> getTodayTests() {
        List<LabTestDto.Response> labTests = labTestService.getTodayTests();
        return ResponseEntity.ok(labTests);
    }

    /**
     * Bekleyen testler (sonucu olmayan)
     */
    @GetMapping("/pending")
    public ResponseEntity<List<LabTestDto.Response>> getPendingTests() {
        List<LabTestDto.Response> labTests = labTestService.getPendingTests();
        return ResponseEntity.ok(labTests);
    }

    /**
     * Tamamlanan testler (sonucu olan)
     */
    @GetMapping("/completed")
    public ResponseEntity<List<LabTestDto.Response>> getCompletedTests() {
        List<LabTestDto.Response> labTests = labTestService.getCompletedTests();
        return ResponseEntity.ok(labTests);
    }

    /**
     * Son 30 günde yapılan testler
     */
    @GetMapping("/recent")
    public ResponseEntity<List<LabTestDto.Response>> getRecentTests() {
        List<LabTestDto.Response> labTests = labTestService.getRecentTests();
        return ResponseEntity.ok(labTests);
    }

    /**
     * Test adı ile lab test arama
     */
    @GetMapping("/search/test-name")
    public ResponseEntity<List<LabTestDto.Response>> searchLabTestsByTestName(@RequestParam String testName) {
        List<LabTestDto.Response> labTests = labTestService.searchLabTestsByTestName(testName);
        return ResponseEntity.ok(labTests);
    }

    /**
     * Hayvan adı ile lab test arama
     */
    @GetMapping("/search/animal")
    public ResponseEntity<List<LabTestDto.Response>> searchLabTestsByAnimalName(@RequestParam String animalName) {
        List<LabTestDto.Response> labTests = labTestService.searchLabTestsByAnimalName(animalName);
        return ResponseEntity.ok(labTests);
    }

    /**
     * Sahip adı ile lab test arama
     */
    @GetMapping("/search/owner")
    public ResponseEntity<List<LabTestDto.Response>> searchLabTestsByOwnerName(@RequestParam String ownerName) {
        List<LabTestDto.Response> labTests = labTestService.searchLabTestsByOwnerName(ownerName);
        return ResponseEntity.ok(labTests);
    }

    /**
     * Test adı ve tarih aralığına göre testleri listeleme
     */
    @GetMapping("/test-name-date-range")
    public ResponseEntity<List<LabTestDto.Response>> getLabTestsByTestNameAndDateRange(
            @RequestParam String testName,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<LabTestDto.Response> labTests = 
            labTestService.getLabTestsByTestNameAndDateRange(testName, startDate, endDate);
        return ResponseEntity.ok(labTests);
    }

    /**
     * Test türü istatistikleri
     */
    @GetMapping("/statistics/test-type")
    public ResponseEntity<List<LabTestDto.TestStatistics>> getTestTypeStatistics() {
        List<LabTestDto.TestStatistics> statistics = labTestService.getTestTypeStatistics();
        return ResponseEntity.ok(statistics);
    }

    /**
     * Dropdown için basit lab test listesi
     */
    @GetMapping("/basic")
    public ResponseEntity<List<LabTestDto.Basic>> getBasicLabTestsList() {
        List<LabTestDto.Basic> labTests = labTestService.getBasicLabTestsList();
        return ResponseEntity.ok(labTests);
    }

    /**
     * Yeni lab test oluşturma
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('VETERINER', 'ADMIN', 'TEKNISYEN')")
    public ResponseEntity<LabTestDto.Response> createLabTest(@Valid @RequestBody LabTestDto.Request request) {
        try {
            LabTestDto.Response labTest = labTestService.createLabTest(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(labTest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lab test güncelleme
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('VETERINER', 'ADMIN', 'TEKNISYEN')")
    public ResponseEntity<LabTestDto.Response> updateLabTest(
            @PathVariable Long id, 
            @Valid @RequestBody LabTestDto.Request request) {
        try {
            LabTestDto.Response labTest = labTestService.updateLabTest(id, request);
            return ResponseEntity.ok(labTest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lab test silme
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VETERINER')")
    public ResponseEntity<Map<String, String>> deleteLabTest(@PathVariable Long id) {
        try {
            labTestService.deleteLabTest(id);
            return ResponseEntity.ok(Map.of(
                "message", "Lab test deleted successfully",
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