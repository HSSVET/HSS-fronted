package com.vetverse.hss.controller;

import com.vetverse.hss.dto.LabResultDto;
import com.vetverse.hss.service.LabResultService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * LabResult Controller
 * LabResult API endpoints
 */
@RestController
@RequestMapping("/api/lab-results")
@PreAuthorize("hasAnyRole('VETERINER', 'ADMIN', 'SEKRETER', 'TEKNISYEN')")
public class LabResultController {

    @Autowired
    private LabResultService labResultService;

    /**
     * Tüm lab sonuçlarını listeleme
     */
    @GetMapping
    public ResponseEntity<List<LabResultDto.Response>> getAllLabResults() {
        List<LabResultDto.Response> labResults = labResultService.getAllLabResults();
        return ResponseEntity.ok(labResults);
    }

    /**
     * Sayfalanmış lab sonuç listesi
     */
    @GetMapping("/paged")
    public ResponseEntity<Page<LabResultDto.Response>> getAllLabResultsPaged(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<LabResultDto.Response> labResults = labResultService.getAllLabResults(pageable);
        return ResponseEntity.ok(labResults);
    }

    /**
     * ID'ye göre lab sonucu bulma
     */
    @GetMapping("/{id}")
    public ResponseEntity<LabResultDto.Response> getLabResultById(@PathVariable Long id) {
        return labResultService.getLabResultById(id)
                .map(labResult -> ResponseEntity.ok(labResult))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Lab test ID'sine göre sonuçları listeleme
     */
    @GetMapping("/lab-test/{labTestId}")
    public ResponseEntity<List<LabResultDto.Response>> getLabResultsByLabTestId(@PathVariable Long labTestId) {
        List<LabResultDto.Response> labResults = labResultService.getLabResultsByLabTestId(labTestId);
        return ResponseEntity.ok(labResults);
    }

    /**
     * Hayvan ID'sine göre tüm lab sonuçları
     */
    @GetMapping("/animal/{animalId}")
    public ResponseEntity<List<LabResultDto.Response>> getLabResultsByAnimalId(@PathVariable Long animalId) {
        List<LabResultDto.Response> labResults = labResultService.getLabResultsByAnimalId(animalId);
        return ResponseEntity.ok(labResults);
    }

    /**
     * Test adına göre sonuçları listeleme
     */
    @GetMapping("/test-name/{testName}")
    public ResponseEntity<List<LabResultDto.Response>> getLabResultsByTestName(@PathVariable String testName) {
        List<LabResultDto.Response> labResults = labResultService.getLabResultsByTestName(testName);
        return ResponseEntity.ok(labResults);
    }

    /**
     * Hayvan ve test adına göre sonuçları listeleme
     */
    @GetMapping("/animal-test")
    public ResponseEntity<List<LabResultDto.Response>> getLabResultsByAnimalIdAndTestName(
            @RequestParam Long animalId, 
            @RequestParam String testName) {
        List<LabResultDto.Response> labResults = labResultService.getLabResultsByAnimalIdAndTestName(animalId, testName);
        return ResponseEntity.ok(labResults);
    }

    /**
     * Sahip ID'sine göre tüm hayvanların lab sonuçları
     */
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<LabResultDto.Response>> getLabResultsByOwnerId(@PathVariable Long ownerId) {
        List<LabResultDto.Response> labResults = labResultService.getLabResultsByOwnerId(ownerId);
        return ResponseEntity.ok(labResults);
    }

    /**
     * Tür ID'sine göre lab sonuçları
     */
    @GetMapping("/species/{speciesId}")
    public ResponseEntity<List<LabResultDto.Response>> getLabResultsBySpeciesId(@PathVariable Long speciesId) {
        List<LabResultDto.Response> labResults = labResultService.getLabResultsBySpeciesId(speciesId);
        return ResponseEntity.ok(labResults);
    }

    /**
     * Irk ID'sine göre lab sonuçları
     */
    @GetMapping("/breed/{breedId}")
    public ResponseEntity<List<LabResultDto.Response>> getLabResultsByBreedId(@PathVariable Long breedId) {
        List<LabResultDto.Response> labResults = labResultService.getLabResultsByBreedId(breedId);
        return ResponseEntity.ok(labResults);
    }

    /**
     * Belirli birim türüne sahip sonuçlar
     */
    @GetMapping("/unit/{unit}")
    public ResponseEntity<List<LabResultDto.Response>> getLabResultsByUnit(@PathVariable String unit) {
        List<LabResultDto.Response> labResults = labResultService.getLabResultsByUnit(unit);
        return ResponseEntity.ok(labResults);
    }

    /**
     * Anormal sonuçlar
     */
    @GetMapping("/abnormal")
    public ResponseEntity<List<LabResultDto.Response>> getAbnormalResults() {
        List<LabResultDto.Response> labResults = labResultService.getAbnormalResults();
        return ResponseEntity.ok(labResults);
    }

    /**
     * Normal sonuçlar
     */
    @GetMapping("/normal")
    public ResponseEntity<List<LabResultDto.Response>> getNormalResults() {
        List<LabResultDto.Response> labResults = labResultService.getNormalResults();
        return ResponseEntity.ok(labResults);
    }

    /**
     * Boş olmayan değere sahip sonuçlar
     */
    @GetMapping("/with-values")
    public ResponseEntity<List<LabResultDto.Response>> getResultsWithValues() {
        List<LabResultDto.Response> labResults = labResultService.getResultsWithValues();
        return ResponseEntity.ok(labResults);
    }

    /**
     * Sonuç değeri ile arama
     */
    @GetMapping("/search/result")
    public ResponseEntity<List<LabResultDto.Response>> searchLabResultsByResult(@RequestParam String result) {
        List<LabResultDto.Response> labResults = labResultService.searchLabResultsByResult(result);
        return ResponseEntity.ok(labResults);
    }

    /**
     * Değer ile arama
     */
    @GetMapping("/search/value")
    public ResponseEntity<List<LabResultDto.Response>> searchLabResultsByValue(@RequestParam String value) {
        List<LabResultDto.Response> labResults = labResultService.searchLabResultsByValue(value);
        return ResponseEntity.ok(labResults);
    }

    /**
     * Birim ile arama
     */
    @GetMapping("/search/unit")
    public ResponseEntity<List<LabResultDto.Response>> searchLabResultsByUnit(@RequestParam String unit) {
        List<LabResultDto.Response> labResults = labResultService.searchLabResultsByUnit(unit);
        return ResponseEntity.ok(labResults);
    }

    /**
     * Test türü ve sonuç istatistikleri
     */
    @GetMapping("/statistics/test-result")
    public ResponseEntity<List<Object[]>> getTestResultStatistics() {
        List<Object[]> statistics = labResultService.getTestResultStatistics();
        return ResponseEntity.ok(statistics);
    }

    /**
     * Yeni lab sonucu oluşturma
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('VETERINER', 'ADMIN', 'TEKNISYEN')")
    public ResponseEntity<LabResultDto.Response> createLabResult(@Valid @RequestBody LabResultDto.Request request) {
        try {
            LabResultDto.Response labResult = labResultService.createLabResult(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(labResult);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lab sonucu güncelleme
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('VETERINER', 'ADMIN', 'TEKNISYEN')")
    public ResponseEntity<LabResultDto.Response> updateLabResult(
            @PathVariable Long id, 
            @Valid @RequestBody LabResultDto.Request request) {
        try {
            LabResultDto.Response labResult = labResultService.updateLabResult(id, request);
            return ResponseEntity.ok(labResult);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lab sonucu silme
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VETERINER')")
    public ResponseEntity<Map<String, String>> deleteLabResult(@PathVariable Long id) {
        try {
            labResultService.deleteLabResult(id);
            return ResponseEntity.ok(Map.of(
                "message", "Lab result deleted successfully",
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