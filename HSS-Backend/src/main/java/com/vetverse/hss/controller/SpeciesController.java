package com.vetverse.hss.controller;

import com.vetverse.hss.dto.SpeciesDto;
import com.vetverse.hss.service.SpeciesService;
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
 * Species Controller
 * Species API endpoints
 */
@RestController
@RequestMapping("/api/species")
@PreAuthorize("hasAnyRole('VETERINER', 'ADMIN', 'SEKRETER')")
public class SpeciesController {

    @Autowired
    private SpeciesService speciesService;

    /**
     * Tüm türleri listeleme
     */
    @GetMapping
    public ResponseEntity<List<SpeciesDto.Response>> getAllSpecies() {
        List<SpeciesDto.Response> species = speciesService.getAllSpecies();
        return ResponseEntity.ok(species);
    }

    /**
     * Sayfalanmış tür listesi
     */
    @GetMapping("/paged")
    public ResponseEntity<Page<SpeciesDto.Response>> getAllSpeciesPaged(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<SpeciesDto.Response> species = speciesService.getAllSpecies(pageable);
        return ResponseEntity.ok(species);
    }

    /**
     * ID'ye göre tür bulma
     */
    @GetMapping("/{id}")
    public ResponseEntity<SpeciesDto.Response> getSpeciesById(@PathVariable Long id) {
        return speciesService.getSpeciesById(id)
                .map(species -> ResponseEntity.ok(species))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * İsme göre tür arama
     */
    @GetMapping("/search")
    public ResponseEntity<List<SpeciesDto.Response>> searchSpecies(@RequestParam String name) {
        List<SpeciesDto.Response> species = speciesService.searchSpeciesByName(name);
        return ResponseEntity.ok(species);
    }

    /**
     * Hayvanları olan türleri listeleme
     */
    @GetMapping("/with-animals")
    public ResponseEntity<List<SpeciesDto.Response>> getSpeciesWithAnimals() {
        List<SpeciesDto.Response> species = speciesService.getSpeciesWithAnimals();
        return ResponseEntity.ok(species);
    }

    /**
     * Dropdown için basit tür listesi
     */
    @GetMapping("/basic")
    public ResponseEntity<List<SpeciesDto.Basic>> getBasicSpeciesList() {
        List<SpeciesDto.Basic> species = speciesService.getBasicSpeciesList();
        return ResponseEntity.ok(species);
    }

    /**
     * Yeni tür oluşturma
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('VETERINER', 'ADMIN')")
    public ResponseEntity<SpeciesDto.Response> createSpecies(@Valid @RequestBody SpeciesDto.Request request) {
        try {
            SpeciesDto.Response species = speciesService.createSpecies(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(species);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Tür güncelleme
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('VETERINER', 'ADMIN')")
    public ResponseEntity<SpeciesDto.Response> updateSpecies(
            @PathVariable Long id, 
            @Valid @RequestBody SpeciesDto.Request request) {
        try {
            SpeciesDto.Response species = speciesService.updateSpecies(id, request);
            return ResponseEntity.ok(species);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Tür silme
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteSpecies(@PathVariable Long id) {
        try {
            speciesService.deleteSpecies(id);
            return ResponseEntity.ok(Map.of(
                "message", "Species deleted successfully",
                "status", "success"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", e.getMessage(),
                "status", "error"
            ));
        }
    }

    /**
     * İsmin mevcut olup olmadığını kontrol etme
     */
    @GetMapping("/check-name")
    public ResponseEntity<Map<String, Boolean>> checkNameExists(@RequestParam String name) {
        boolean exists = speciesService.existsByName(name);
        return ResponseEntity.ok(Map.of("exists", exists));
    }
} 