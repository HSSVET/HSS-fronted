package com.vetverse.hss.controller;

import com.vetverse.hss.dto.AnimalDto;
import com.vetverse.hss.service.AnimalService;
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
 * Animal Controller
 * Animal API endpoints
 */
@RestController
@RequestMapping("/api/animals")
@PreAuthorize("hasAnyRole('VETERINER', 'ADMIN', 'SEKRETER')")
public class AnimalController {

    @Autowired
    private AnimalService animalService;

    /**
     * Tüm hayvanları listeleme
     */
    @GetMapping
    public ResponseEntity<List<AnimalDto.Response>> getAllAnimals() {
        List<AnimalDto.Response> animals = animalService.getAllAnimals();
        return ResponseEntity.ok(animals);
    }

    /**
     * Sayfalanmış hayvan listesi
     */
    @GetMapping("/paged")
    public ResponseEntity<Page<AnimalDto.Response>> getAllAnimalsPaged(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<AnimalDto.Response> animals = animalService.getAllAnimals(pageable);
        return ResponseEntity.ok(animals);
    }

    /**
     * ID'ye göre hayvan bulma
     */
    @GetMapping("/{id}")
    public ResponseEntity<AnimalDto.Response> getAnimalById(@PathVariable Long id) {
        return animalService.getAnimalById(id)
                .map(animal -> ResponseEntity.ok(animal))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Mikroçip numarasına göre hayvan bulma
     */
    @GetMapping("/microchip/{microchipNumber}")
    public ResponseEntity<AnimalDto.Response> getAnimalByMicrochip(@PathVariable String microchipNumber) {
        return animalService.getAnimalByMicrochip(microchipNumber)
                .map(animal -> ResponseEntity.ok(animal))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Sahibe göre hayvan listeleme
     */
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<AnimalDto.Response>> getAnimalsByOwnerId(@PathVariable Long ownerId) {
        List<AnimalDto.Response> animals = animalService.getAnimalsByOwnerId(ownerId);
        return ResponseEntity.ok(animals);
    }

    /**
     * Türe göre hayvan listeleme
     */
    @GetMapping("/species/{speciesId}")
    public ResponseEntity<List<AnimalDto.Response>> getAnimalsBySpeciesId(@PathVariable Long speciesId) {
        List<AnimalDto.Response> animals = animalService.getAnimalsBySpeciesId(speciesId);
        return ResponseEntity.ok(animals);
    }

    /**
     * Irka göre hayvan listeleme
     */
    @GetMapping("/breed/{breedId}")
    public ResponseEntity<List<AnimalDto.Response>> getAnimalsByBreedId(@PathVariable Long breedId) {
        List<AnimalDto.Response> animals = animalService.getAnimalsByBreedId(breedId);
        return ResponseEntity.ok(animals);
    }

    /**
     * İsme göre hayvan arama
     */
    @GetMapping("/search/name")
    public ResponseEntity<List<AnimalDto.Response>> searchAnimalsByName(@RequestParam String name) {
        List<AnimalDto.Response> animals = animalService.searchAnimalsByName(name);
        return ResponseEntity.ok(animals);
    }

    /**
     * Sahip adına göre hayvan arama
     */
    @GetMapping("/search/owner")
    public ResponseEntity<List<AnimalDto.Response>> searchAnimalsByOwnerName(@RequestParam String ownerName) {
        List<AnimalDto.Response> animals = animalService.searchAnimalsByOwnerName(ownerName);
        return ResponseEntity.ok(animals);
    }

    /**
     * Mikroçip numarasına göre hayvan arama
     */
    @GetMapping("/search/microchip")
    public ResponseEntity<List<AnimalDto.Response>> searchAnimalsByMicrochip(@RequestParam String microchip) {
        List<AnimalDto.Response> animals = animalService.searchAnimalsByMicrochip(microchip);
        return ResponseEntity.ok(animals);
    }

    /**
     * Alerji bilgisi olan hayvanları listeleme
     */
    @GetMapping("/with-allergies")
    public ResponseEntity<List<AnimalDto.Response>> getAnimalsWithAllergies() {
        List<AnimalDto.Response> animals = animalService.getAnimalsWithAllergies();
        return ResponseEntity.ok(animals);
    }

    /**
     * Kronik hastalığı olan hayvanları listeleme
     */
    @GetMapping("/with-chronic-diseases")
    public ResponseEntity<List<AnimalDto.Response>> getAnimalsWithChronicDiseases() {
        List<AnimalDto.Response> animals = animalService.getAnimalsWithChronicDiseases();
        return ResponseEntity.ok(animals);
    }

    /**
     * Bugün doğum günü olan hayvanları listeleme
     */
    @GetMapping("/birthday-today")
    public ResponseEntity<List<AnimalDto.Response>> getAnimalsWithBirthdayToday() {
        List<AnimalDto.Response> animals = animalService.getAnimalsWithBirthdayToday();
        return ResponseEntity.ok(animals);
    }

    /**
     * Bu ay doğum günü olan hayvanları listeleme
     */
    @GetMapping("/birthday-this-month")
    public ResponseEntity<List<AnimalDto.Response>> getAnimalsWithBirthdayThisMonth() {
        List<AnimalDto.Response> animals = animalService.getAnimalsWithBirthdayThisMonth();
        return ResponseEntity.ok(animals);
    }

    /**
     * Dropdown için basit hayvan listesi
     */
    @GetMapping("/basic")
    public ResponseEntity<List<AnimalDto.Basic>> getBasicAnimalsList() {
        List<AnimalDto.Basic> animals = animalService.getBasicAnimalsList();
        return ResponseEntity.ok(animals);
    }

    /**
     * Yeni hayvan oluşturma
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('VETERINER', 'ADMIN', 'SEKRETER')")
    public ResponseEntity<AnimalDto.Response> createAnimal(@Valid @RequestBody AnimalDto.Request request) {
        try {
            AnimalDto.Response animal = animalService.createAnimal(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(animal);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Hayvan güncelleme
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('VETERINER', 'ADMIN', 'SEKRETER')")
    public ResponseEntity<AnimalDto.Response> updateAnimal(
            @PathVariable Long id, 
            @Valid @RequestBody AnimalDto.Request request) {
        try {
            AnimalDto.Response animal = animalService.updateAnimal(id, request);
            return ResponseEntity.ok(animal);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Hayvan silme
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VETERINER')")
    public ResponseEntity<Map<String, String>> deleteAnimal(@PathVariable Long id) {
        try {
            animalService.deleteAnimal(id);
            return ResponseEntity.ok(Map.of(
                "message", "Animal deleted successfully",
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
     * Mikroçip numarasının mevcut olup olmadığını kontrol etme
     */
    @GetMapping("/check-microchip")
    public ResponseEntity<Map<String, Boolean>> checkMicrochipExists(@RequestParam String microchipNumber) {
        boolean exists = animalService.existsByMicrochipNumber(microchipNumber);
        return ResponseEntity.ok(Map.of("exists", exists));
    }
} 