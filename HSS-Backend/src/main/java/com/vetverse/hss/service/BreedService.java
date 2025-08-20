package com.vetverse.hss.service;

import com.vetverse.hss.dto.BreedDto;
import com.vetverse.hss.dto.SpeciesDto;
import com.vetverse.hss.entity.Breed;
import com.vetverse.hss.entity.Species;
import com.vetverse.hss.repository.BreedRepository;
import com.vetverse.hss.repository.SpeciesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Breed Service
 * Breed entity'si için business logic katmanı
 */
@Service
@Transactional
public class BreedService {

    @Autowired
    private BreedRepository breedRepository;

    @Autowired
    private SpeciesRepository speciesRepository;

    /**
     * Tüm ırkları listeleme
     */
    @Transactional(readOnly = true)
    public List<BreedDto.Response> getAllBreeds() {
        return breedRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sayfalanmış ırk listesi
     */
    @Transactional(readOnly = true)
    public Page<BreedDto.Response> getAllBreeds(Pageable pageable) {
        return breedRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    /**
     * ID'ye göre ırk bulma
     */
    @Transactional(readOnly = true)
    public Optional<BreedDto.Response> getBreedById(Long id) {
        return breedRepository.findById(id)
                .map(this::convertToResponse);
    }

    /**
     * Belirli bir türe ait ırkları listeleme
     */
    @Transactional(readOnly = true)
    public List<BreedDto.Response> getBreedsBySpeciesId(Long speciesId) {
        return breedRepository.findBySpeciesId(speciesId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * İsme göre ırk arama
     */
    @Transactional(readOnly = true)
    public List<BreedDto.Response> searchBreedsByName(String name) {
        return breedRepository.searchByName(name).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Belirli türde isim ile ırk arama
     */
    @Transactional(readOnly = true)
    public List<BreedDto.Response> searchBreedsByNameAndSpecies(String name, Long speciesId) {
        return breedRepository.searchByNameAndSpecies(name, speciesId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Hayvanları olan ırkları listeleme
     */
    @Transactional(readOnly = true)
    public List<BreedDto.Response> getBreedsWithAnimals() {
        return breedRepository.findBreedsWithAnimals().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Dropdown için basit ırk listesi
     */
    @Transactional(readOnly = true)
    public List<BreedDto.Basic> getBasicBreedsList() {
        return breedRepository.findAll().stream()
                .map(this::convertToBasic)
                .collect(Collectors.toList());
    }

    /**
     * Belirli türe ait basit ırk listesi
     */
    @Transactional(readOnly = true)
    public List<BreedDto.Basic> getBasicBreedsBySpeciesId(Long speciesId) {
        return breedRepository.findBySpeciesId(speciesId).stream()
                .map(this::convertToBasic)
                .collect(Collectors.toList());
    }

    /**
     * Yeni ırk oluşturma
     */
    public BreedDto.Response createBreed(BreedDto.Request request) {
        // İsim kontrolü
        if (breedRepository.existsByName(request.getName())) {
            throw new RuntimeException("Breed with name '" + request.getName() + "' already exists");
        }

        // Tür kontrolü
        Species species = speciesRepository.findById(request.getSpeciesId())
                .orElseThrow(() -> new RuntimeException("Species not found with id: " + request.getSpeciesId()));

        Breed breed = new Breed(request.getName(), species);
        breed = breedRepository.save(breed);
        
        return convertToResponse(breed);
    }

    /**
     * Irk güncelleme
     */
    public BreedDto.Response updateBreed(Long id, BreedDto.Request request) {
        Breed breed = breedRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Breed not found with id: " + id));

        // Farklı bir ırkta aynı isim kontrolü
        if (!breed.getName().equals(request.getName()) && 
            breedRepository.existsByName(request.getName())) {
            throw new RuntimeException("Breed with name '" + request.getName() + "' already exists");
        }

        // Tür kontrolü
        Species species = speciesRepository.findById(request.getSpeciesId())
                .orElseThrow(() -> new RuntimeException("Species not found with id: " + request.getSpeciesId()));

        breed.setName(request.getName());
        breed.setSpecies(species);
        breed = breedRepository.save(breed);
        
        return convertToResponse(breed);
    }

    /**
     * Irk silme
     */
    public void deleteBreed(Long id) {
        Breed breed = breedRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Breed not found with id: " + id));

        // Hayvanları olan ırkı silme kontrolü
        if (!breed.getAnimals().isEmpty()) {
            throw new RuntimeException("Cannot delete breed that has animals. Please reassign animals first.");
        }

        breedRepository.delete(breed);
    }

    /**
     * İsmin mevcut olup olmadığını kontrol etme
     */
    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return breedRepository.existsByName(name);
    }

    // Helper methods
    private BreedDto.Response convertToResponse(Breed breed) {
        BreedDto.Response response = new BreedDto.Response();
        response.setId(breed.getId());
        response.setName(breed.getName());
        
        if (breed.getSpecies() != null) {
            response.setSpecies(new SpeciesDto.Basic(
                    breed.getSpecies().getId(),
                    breed.getSpecies().getName()
            ));
        }
        
        response.setAnimalCount(breed.getAnimals().size());
        return response;
    }

    private BreedDto.Basic convertToBasic(Breed breed) {
        return new BreedDto.Basic(
                breed.getId(),
                breed.getName(),
                breed.getSpecies() != null ? breed.getSpecies().getId() : null
        );
    }
} 