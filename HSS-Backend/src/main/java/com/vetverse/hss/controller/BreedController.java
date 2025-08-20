package com.vetverse.hss.controller;

import com.vetverse.hss.dto.BreedDto;
import com.vetverse.hss.service.BreedService;
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
 * Breed Controller
 * Breed API endpoints
 */
@RestController
@RequestMapping("/api/breeds")
@PreAuthorize("hasAnyRole('VETERINER', 'ADMIN', 'SEKRETER')")
public class BreedController {

    @Autowired
    private BreedService breedService;

    /**
     * Tüm ırkları listeleme
     */
    @GetMapping
    public ResponseEntity<List<BreedDto.Response>> getAllBreeds() {
        List<BreedDto.Response> breeds = breedService.getAllBreeds();
        return ResponseEntity.ok(breeds);
    }

    /**
     * Sayfalanmış ırk listesi
     */
    @GetMapping("/paged")
    public ResponseEntity<Page<BreedDto.Response>> getAllBreedsPaged(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<BreedDto.Response> breeds = breedService.getAllBreeds(pageable);
        return ResponseEntity.ok(breeds);
    }

    /**
     * ID'ye göre ırk bulma
     */
    @GetMapping("/{id}")
    public ResponseEntity<BreedDto.Response> getBreedById(@PathVariable Long id) {
        return breedService.getBreedById(id)
                .map(breed -> ResponseEntity.ok(breed))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Belirli bir türe ait ırkları listeleme
     */
    @GetMapping("/species/{speciesId}")
    public ResponseEntity<List<BreedDto.Response>> getBreedsBySpeciesId(@PathVariable Long speciesId) {
        List<BreedDto.Response> breeds = breedService.getBreedsBySpeciesId(speciesId);
        return ResponseEntity.ok(breeds);
    }

    /**
     * İsme göre ırk arama
     */
    @GetMapping("/search")
    public ResponseEntity<List<BreedDto.Response>> searchBreeds(@RequestParam String name) {
        List<BreedDto.Response> breeds = breedService.searchBreedsByName(name);
        return ResponseEntity.ok(breeds);
    }

    /**
     * Belirli türde isim ile ırk arama
     */
    @GetMapping("/search/species/{speciesId}")
    public ResponseEntity<List<BreedDto.Response>> searchBreedsByNameAndSpecies(
            @PathVariable Long speciesId, 
            @RequestParam String name) {
        List<BreedDto.Response> breeds = breedService.searchBreedsByNameAndSpecies(name, speciesId);
        return ResponseEntity.ok(breeds);
    }

    /**
     * Hayvanları olan ırkları listeleme
     */
    @GetMapping("/with-animals")
    public ResponseEntity<List<BreedDto.Response>> getBreedsWithAnimals() {
        List<BreedDto.Response> breeds = breedService.getBreedsWithAnimals();
        return ResponseEntity.ok(breeds);
    }

    /**
     * Dropdown için basit ırk listesi
     */
    @GetMapping("/basic")
    public ResponseEntity<List<BreedDto.Basic>> getBasicBreedsList() {
        List<BreedDto.Basic> breeds = breedService.getBasicBreedsList();
        return ResponseEntity.ok(breeds);
    }

    /**
     * Belirli türe ait basit ırk listesi
     */
    @GetMapping("/basic/species/{speciesId}")
    public ResponseEntity<List<BreedDto.Basic>> getBasicBreedsBySpeciesId(@PathVariable Long speciesId) {
        List<BreedDto.Basic> breeds = breedService.getBasicBreedsBySpeciesId(speciesId);
        return ResponseEntity.ok(breeds);
    }

    /**
     * Yeni ırk oluşturma
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('VETERINER', 'ADMIN')")
    public ResponseEntity<BreedDto.Response> createBreed(@Valid @RequestBody BreedDto.Request request) {
        try {
            BreedDto.Response breed = breedService.createBreed(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(breed);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Irk güncelleme
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('VETERINER', 'ADMIN')")
    public ResponseEntity<BreedDto.Response> updateBreed(
            @PathVariable Long id, 
            @Valid @RequestBody BreedDto.Request request) {
        try {
            BreedDto.Response breed = breedService.updateBreed(id, request);
            return ResponseEntity.ok(breed);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Irk silme
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteBreed(@PathVariable Long id) {
        try {
            breedService.deleteBreed(id);
            return ResponseEntity.ok(Map.of(
                "message", "Breed deleted successfully",
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
        boolean exists = breedService.existsByName(name);
        return ResponseEntity.ok(Map.of("exists", exists));
    }
} 