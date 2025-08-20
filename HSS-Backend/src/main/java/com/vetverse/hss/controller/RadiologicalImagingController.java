package com.vetverse.hss.controller;

import com.vetverse.hss.dto.RadiologicalImagingDto;
import com.vetverse.hss.service.RadiologicalImagingService;
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
 * RadiologicalImaging Controller
 * RadiologicalImaging API endpoints
 */
@RestController
@RequestMapping("/api/radiological-imagings")
@PreAuthorize("hasAnyRole('VETERINER', 'ADMIN', 'SEKRETER', 'TEKNISYEN')")
public class RadiologicalImagingController {

    @Autowired
    private RadiologicalImagingService radiologicalImagingService;

    /**
     * Tüm radyolojik görüntüleri listeleme
     */
    @GetMapping
    public ResponseEntity<List<RadiologicalImagingDto.Response>> getAllRadiologicalImagings() {
        List<RadiologicalImagingDto.Response> imagings = radiologicalImagingService.getAllRadiologicalImagings();
        return ResponseEntity.ok(imagings);
    }

    /**
     * Sayfalanmış radyolojik görüntü listesi
     */
    @GetMapping("/paged")
    public ResponseEntity<Page<RadiologicalImagingDto.Response>> getAllRadiologicalImagingsPaged(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<RadiologicalImagingDto.Response> imagings = radiologicalImagingService.getAllRadiologicalImagings(pageable);
        return ResponseEntity.ok(imagings);
    }

    /**
     * ID'ye göre radyolojik görüntü bulma
     */
    @GetMapping("/{id}")
    public ResponseEntity<RadiologicalImagingDto.Response> getRadiologicalImagingById(@PathVariable Long id) {
        return radiologicalImagingService.getRadiologicalImagingById(id)
                .map(imaging -> ResponseEntity.ok(imaging))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Hayvan ID'sine göre radyolojik görüntüleri listeleme
     */
    @GetMapping("/animal/{animalId}")
    public ResponseEntity<List<RadiologicalImagingDto.Response>> getRadiologicalImagingsByAnimalId(@PathVariable Long animalId) {
        List<RadiologicalImagingDto.Response> imagings = radiologicalImagingService.getRadiologicalImagingsByAnimalId(animalId);
        return ResponseEntity.ok(imagings);
    }

    /**
     * Görüntü türüne göre radyolojik görüntüleri listeleme
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<RadiologicalImagingDto.Response>> getRadiologicalImagingsByType(@PathVariable String type) {
        List<RadiologicalImagingDto.Response> imagings = radiologicalImagingService.getRadiologicalImagingsByType(type);
        return ResponseEntity.ok(imagings);
    }

    /**
     * Sahip ID'sine göre radyolojik görüntüleri listeleme
     */
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<RadiologicalImagingDto.Response>> getRadiologicalImagingsByOwnerId(@PathVariable Long ownerId) {
        List<RadiologicalImagingDto.Response> imagings = radiologicalImagingService.getRadiologicalImagingsByOwnerId(ownerId);
        return ResponseEntity.ok(imagings);
    }

    /**
     * Tür ID'sine göre radyolojik görüntüleri listeleme
     */
    @GetMapping("/species/{speciesId}")
    public ResponseEntity<List<RadiologicalImagingDto.Response>> getRadiologicalImagingsBySpeciesId(@PathVariable Long speciesId) {
        List<RadiologicalImagingDto.Response> imagings = radiologicalImagingService.getRadiologicalImagingsBySpeciesId(speciesId);
        return ResponseEntity.ok(imagings);
    }

    /**
     * Irk ID'sine göre radyolojik görüntüleri listeleme
     */
    @GetMapping("/breed/{breedId}")
    public ResponseEntity<List<RadiologicalImagingDto.Response>> getRadiologicalImagingsByBreedId(@PathVariable Long breedId) {
        List<RadiologicalImagingDto.Response> imagings = radiologicalImagingService.getRadiologicalImagingsByBreedId(breedId);
        return ResponseEntity.ok(imagings);
    }

    /**
     * Tarih aralığına göre radyolojik görüntüleri listeleme
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<RadiologicalImagingDto.Response>> getRadiologicalImagingsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<RadiologicalImagingDto.Response> imagings = radiologicalImagingService.getRadiologicalImagingsByDateRange(startDate, endDate);
        return ResponseEntity.ok(imagings);
    }

    /**
     * Belirli tarihteki görüntüleri listeleme
     */
    @GetMapping("/date/{date}")
    public ResponseEntity<List<RadiologicalImagingDto.Response>> getRadiologicalImagingsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<RadiologicalImagingDto.Response> imagings = radiologicalImagingService.getRadiologicalImagingsByDate(date);
        return ResponseEntity.ok(imagings);
    }

    /**
     * Bugünkü radyolojik görüntüleri listeleme
     */
    @GetMapping("/today")
    public ResponseEntity<List<RadiologicalImagingDto.Response>> getTodayImagings() {
        List<RadiologicalImagingDto.Response> imagings = radiologicalImagingService.getTodayImagings();
        return ResponseEntity.ok(imagings);
    }

    /**
     * Son 30 günde çekilen görüntüler
     */
    @GetMapping("/recent")
    public ResponseEntity<List<RadiologicalImagingDto.Response>> getRecentImagings() {
        List<RadiologicalImagingDto.Response> imagings = radiologicalImagingService.getRecentImagings();
        return ResponseEntity.ok(imagings);
    }

    /**
     * Görüntü URL'si olan kayıtları listeleme
     */
    @GetMapping("/with-image")
    public ResponseEntity<List<RadiologicalImagingDto.Response>> getRadiologicalImagingsWithImageUrl() {
        List<RadiologicalImagingDto.Response> imagings = radiologicalImagingService.getRadiologicalImagingsWithImageUrl();
        return ResponseEntity.ok(imagings);
    }

    /**
     * Yorumu olan görüntüleri listeleme
     */
    @GetMapping("/with-comments")
    public ResponseEntity<List<RadiologicalImagingDto.Response>> getRadiologicalImagingsWithComments() {
        List<RadiologicalImagingDto.Response> imagings = radiologicalImagingService.getRadiologicalImagingsWithComments();
        return ResponseEntity.ok(imagings);
    }

    /**
     * Yorumu olmayan görüntüleri listeleme
     */
    @GetMapping("/without-comments")
    public ResponseEntity<List<RadiologicalImagingDto.Response>> getRadiologicalImagingsWithoutComments() {
        List<RadiologicalImagingDto.Response> imagings = radiologicalImagingService.getRadiologicalImagingsWithoutComments();
        return ResponseEntity.ok(imagings);
    }

    /**
     * Görüntü türü ile radyolojik görüntü arama
     */
    @GetMapping("/search/type")
    public ResponseEntity<List<RadiologicalImagingDto.Response>> searchRadiologicalImagingsByType(@RequestParam String type) {
        List<RadiologicalImagingDto.Response> imagings = radiologicalImagingService.searchRadiologicalImagingsByType(type);
        return ResponseEntity.ok(imagings);
    }

    /**
     * Yorum ile radyolojik görüntü arama
     */
    @GetMapping("/search/comment")
    public ResponseEntity<List<RadiologicalImagingDto.Response>> searchRadiologicalImagingsByComment(@RequestParam String comment) {
        List<RadiologicalImagingDto.Response> imagings = radiologicalImagingService.searchRadiologicalImagingsByComment(comment);
        return ResponseEntity.ok(imagings);
    }

    /**
     * Hayvan adı ile radyolojik görüntü arama
     */
    @GetMapping("/search/animal")
    public ResponseEntity<List<RadiologicalImagingDto.Response>> searchRadiologicalImagingsByAnimalName(@RequestParam String animalName) {
        List<RadiologicalImagingDto.Response> imagings = radiologicalImagingService.searchRadiologicalImagingsByAnimalName(animalName);
        return ResponseEntity.ok(imagings);
    }

    /**
     * Sahip adı ile radyolojik görüntü arama
     */
    @GetMapping("/search/owner")
    public ResponseEntity<List<RadiologicalImagingDto.Response>> searchRadiologicalImagingsByOwnerName(@RequestParam String ownerName) {
        List<RadiologicalImagingDto.Response> imagings = radiologicalImagingService.searchRadiologicalImagingsByOwnerName(ownerName);
        return ResponseEntity.ok(imagings);
    }

    /**
     * Görüntü türü ve tarih aralığına göre görüntüleri listeleme
     */
    @GetMapping("/type-date-range")
    public ResponseEntity<List<RadiologicalImagingDto.Response>> getRadiologicalImagingsByTypeAndDateRange(
            @RequestParam String type,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<RadiologicalImagingDto.Response> imagings = 
            radiologicalImagingService.getRadiologicalImagingsByTypeAndDateRange(type, startDate, endDate);
        return ResponseEntity.ok(imagings);
    }

    /**
     * Frontend için görüntü kayıtları
     */
    @GetMapping("/records/animal/{animalId}")
    public ResponseEntity<List<RadiologicalImagingDto.ImagingRecord>> getImagingRecordsByAnimalId(@PathVariable Long animalId) {
        List<RadiologicalImagingDto.ImagingRecord> records = radiologicalImagingService.getImagingRecordsByAnimalId(animalId);
        return ResponseEntity.ok(records);
    }

    /**
     * Görüntü türü istatistikleri
     */
    @GetMapping("/statistics/type")
    public ResponseEntity<List<RadiologicalImagingDto.ImagingTypeStatistics>> getImagingTypeStatistics() {
        List<RadiologicalImagingDto.ImagingTypeStatistics> statistics = radiologicalImagingService.getImagingTypeStatistics();
        return ResponseEntity.ok(statistics);
    }

    /**
     * Dropdown için basit radyolojik görüntü listesi
     */
    @GetMapping("/basic")
    public ResponseEntity<List<RadiologicalImagingDto.Basic>> getBasicRadiologicalImagingsList() {
        List<RadiologicalImagingDto.Basic> imagings = radiologicalImagingService.getBasicRadiologicalImagingsList();
        return ResponseEntity.ok(imagings);
    }

    /**
     * Yeni radyolojik görüntü oluşturma
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('VETERINER', 'ADMIN', 'TEKNISYEN')")
    public ResponseEntity<RadiologicalImagingDto.Response> createRadiologicalImaging(@Valid @RequestBody RadiologicalImagingDto.Request request) {
        try {
            RadiologicalImagingDto.Response imaging = radiologicalImagingService.createRadiologicalImaging(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(imaging);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Radyolojik görüntü güncelleme
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('VETERINER', 'ADMIN', 'TEKNISYEN')")
    public ResponseEntity<RadiologicalImagingDto.Response> updateRadiologicalImaging(
            @PathVariable Long id, 
            @Valid @RequestBody RadiologicalImagingDto.Request request) {
        try {
            RadiologicalImagingDto.Response imaging = radiologicalImagingService.updateRadiologicalImaging(id, request);
            return ResponseEntity.ok(imaging);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Radyolojik görüntü silme
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VETERINER')")
    public ResponseEntity<Map<String, String>> deleteRadiologicalImaging(@PathVariable Long id) {
        try {
            radiologicalImagingService.deleteRadiologicalImaging(id);
            return ResponseEntity.ok(Map.of(
                "message", "Radiological imaging deleted successfully",
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