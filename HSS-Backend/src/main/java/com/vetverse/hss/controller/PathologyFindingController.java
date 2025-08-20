package com.vetverse.hss.controller;

import com.vetverse.hss.dto.PathologyFindingDto;
import com.vetverse.hss.service.PathologyFindingService;
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
 * PathologyFinding Controller
 * PathologyFinding API endpoints
 */
@RestController
@RequestMapping("/api/pathology-findings")
@PreAuthorize("hasAnyRole('VETERINER', 'ADMIN', 'SEKRETER')")
public class PathologyFindingController {

    @Autowired
    private PathologyFindingService pathologyFindingService;

    /**
     * Tüm patoloji bulgularını listeleme
     */
    @GetMapping
    public ResponseEntity<List<PathologyFindingDto.Response>> getAllPathologyFindings() {
        List<PathologyFindingDto.Response> findings = pathologyFindingService.getAllPathologyFindings();
        return ResponseEntity.ok(findings);
    }

    /**
     * Sayfalanmış patoloji bulgusu listesi
     */
    @GetMapping("/paged")
    public ResponseEntity<Page<PathologyFindingDto.Response>> getAllPathologyFindingsPaged(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<PathologyFindingDto.Response> findings = pathologyFindingService.getAllPathologyFindings(pageable);
        return ResponseEntity.ok(findings);
    }

    /**
     * ID'ye göre patoloji bulgusu bulma
     */
    @GetMapping("/{id}")
    public ResponseEntity<PathologyFindingDto.Response> getPathologyFindingById(@PathVariable Long id) {
        return pathologyFindingService.getPathologyFindingById(id)
                .map(finding -> ResponseEntity.ok(finding))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Hayvan ID'sine göre patoloji bulgularını listeleme
     */
    @GetMapping("/animal/{animalId}")
    public ResponseEntity<List<PathologyFindingDto.Response>> getPathologyFindingsByAnimalId(@PathVariable Long animalId) {
        List<PathologyFindingDto.Response> findings = pathologyFindingService.getPathologyFindingsByAnimalId(animalId);
        return ResponseEntity.ok(findings);
    }

    /**
     * Sahip ID'sine göre patoloji bulgularını listeleme
     */
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<PathologyFindingDto.Response>> getPathologyFindingsByOwnerId(@PathVariable Long ownerId) {
        List<PathologyFindingDto.Response> findings = pathologyFindingService.getPathologyFindingsByOwnerId(ownerId);
        return ResponseEntity.ok(findings);
    }

    /**
     * Tür ID'sine göre patoloji bulgularını listeleme
     */
    @GetMapping("/species/{speciesId}")
    public ResponseEntity<List<PathologyFindingDto.Response>> getPathologyFindingsBySpeciesId(@PathVariable Long speciesId) {
        List<PathologyFindingDto.Response> findings = pathologyFindingService.getPathologyFindingsBySpeciesId(speciesId);
        return ResponseEntity.ok(findings);
    }

    /**
     * Irk ID'sine göre patoloji bulgularını listeleme
     */
    @GetMapping("/breed/{breedId}")
    public ResponseEntity<List<PathologyFindingDto.Response>> getPathologyFindingsByBreedId(@PathVariable Long breedId) {
        List<PathologyFindingDto.Response> findings = pathologyFindingService.getPathologyFindingsByBreedId(breedId);
        return ResponseEntity.ok(findings);
    }

    /**
     * Tarih aralığına göre patoloji bulgularını listeleme
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<PathologyFindingDto.Response>> getPathologyFindingsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<PathologyFindingDto.Response> findings = pathologyFindingService.getPathologyFindingsByDateRange(startDate, endDate);
        return ResponseEntity.ok(findings);
    }

    /**
     * Belirli tarihteki patoloji bulgularını listeleme
     */
    @GetMapping("/date/{date}")
    public ResponseEntity<List<PathologyFindingDto.Response>> getPathologyFindingsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<PathologyFindingDto.Response> findings = pathologyFindingService.getPathologyFindingsByDate(date);
        return ResponseEntity.ok(findings);
    }

    /**
     * Bugünkü patoloji bulgularını listeleme
     */
    @GetMapping("/today")
    public ResponseEntity<List<PathologyFindingDto.Response>> getTodayFindings() {
        List<PathologyFindingDto.Response> findings = pathologyFindingService.getTodayFindings();
        return ResponseEntity.ok(findings);
    }

    /**
     * Son 30 günde eklenen patoloji bulguları
     */
    @GetMapping("/recent")
    public ResponseEntity<List<PathologyFindingDto.Response>> getRecentFindings() {
        List<PathologyFindingDto.Response> findings = pathologyFindingService.getRecentFindings();
        return ResponseEntity.ok(findings);
    }

    /**
     * Rapor ile patoloji bulgusu arama
     */
    @GetMapping("/search/report")
    public ResponseEntity<List<PathologyFindingDto.Response>> searchPathologyFindingsByReport(@RequestParam String report) {
        List<PathologyFindingDto.Response> findings = pathologyFindingService.searchPathologyFindingsByReport(report);
        return ResponseEntity.ok(findings);
    }

    /**
     * Hayvan adı ile patoloji bulgusu arama
     */
    @GetMapping("/search/animal")
    public ResponseEntity<List<PathologyFindingDto.Response>> searchPathologyFindingsByAnimalName(@RequestParam String animalName) {
        List<PathologyFindingDto.Response> findings = pathologyFindingService.searchPathologyFindingsByAnimalName(animalName);
        return ResponseEntity.ok(findings);
    }

    /**
     * Sahip adı ile patoloji bulgusu arama
     */
    @GetMapping("/search/owner")
    public ResponseEntity<List<PathologyFindingDto.Response>> searchPathologyFindingsByOwnerName(@RequestParam String ownerName) {
        List<PathologyFindingDto.Response> findings = pathologyFindingService.searchPathologyFindingsByOwnerName(ownerName);
        return ResponseEntity.ok(findings);
    }

    /**
     * Dropdown için basit patoloji bulgusu listesi
     */
    @GetMapping("/basic")
    public ResponseEntity<List<PathologyFindingDto.Basic>> getBasicPathologyFindingsList() {
        List<PathologyFindingDto.Basic> findings = pathologyFindingService.getBasicPathologyFindingsList();
        return ResponseEntity.ok(findings);
    }

    /**
     * Yeni patoloji bulgusu oluşturma
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('VETERINER', 'ADMIN')")
    public ResponseEntity<PathologyFindingDto.Response> createPathologyFinding(@Valid @RequestBody PathologyFindingDto.Request request) {
        try {
            PathologyFindingDto.Response finding = pathologyFindingService.createPathologyFinding(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(finding);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Patoloji bulgusu güncelleme
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('VETERINER', 'ADMIN')")
    public ResponseEntity<PathologyFindingDto.Response> updatePathologyFinding(
            @PathVariable Long id, 
            @Valid @RequestBody PathologyFindingDto.Request request) {
        try {
            PathologyFindingDto.Response finding = pathologyFindingService.updatePathologyFinding(id, request);
            return ResponseEntity.ok(finding);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Patoloji bulgusu silme
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VETERINER')")
    public ResponseEntity<Map<String, String>> deletePathologyFinding(@PathVariable Long id) {
        try {
            pathologyFindingService.deletePathologyFinding(id);
            return ResponseEntity.ok(Map.of(
                "message", "Pathology finding deleted successfully",
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