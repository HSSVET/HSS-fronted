package com.vetverse.hss.service;

import com.vetverse.hss.dto.SpeciesDto;
import com.vetverse.hss.entity.Species;
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
 * Species Service
 * Species entity'si için business logic katmanı
 */
@Service
@Transactional
public class SpeciesService {

    @Autowired
    private SpeciesRepository speciesRepository;

    /**
     * Tüm türleri listeleme
     */
    @Transactional(readOnly = true)
    public List<SpeciesDto.Response> getAllSpecies() {
        return speciesRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sayfalanmış tür listesi
     */
    @Transactional(readOnly = true)
    public Page<SpeciesDto.Response> getAllSpecies(Pageable pageable) {
        return speciesRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    /**
     * ID'ye göre tür bulma
     */
    @Transactional(readOnly = true)
    public Optional<SpeciesDto.Response> getSpeciesById(Long id) {
        return speciesRepository.findById(id)
                .map(this::convertToResponse);
    }

    /**
     * İsme göre tür arama
     */
    @Transactional(readOnly = true)
    public List<SpeciesDto.Response> searchSpeciesByName(String name) {
        return speciesRepository.searchByName(name).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Hayvanları olan türleri listeleme
     */
    @Transactional(readOnly = true)
    public List<SpeciesDto.Response> getSpeciesWithAnimals() {
        return speciesRepository.findSpeciesWithAnimals().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Dropdown için basit tür listesi
     */
    @Transactional(readOnly = true)
    public List<SpeciesDto.Basic> getBasicSpeciesList() {
        return speciesRepository.findAll().stream()
                .map(this::convertToBasic)
                .collect(Collectors.toList());
    }

    /**
     * Yeni tür oluşturma
     */
    public SpeciesDto.Response createSpecies(SpeciesDto.Request request) {
        // İsim kontrolü
        if (speciesRepository.existsByName(request.getName())) {
            throw new RuntimeException("Species with name '" + request.getName() + "' already exists");
        }

        Species species = new Species(request.getName());
        species = speciesRepository.save(species);
        
        return convertToResponse(species);
    }

    /**
     * Tür güncelleme
     */
    public SpeciesDto.Response updateSpecies(Long id, SpeciesDto.Request request) {
        Species species = speciesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Species not found with id: " + id));

        // Farklı bir türde aynı isim kontrolü
        if (!species.getName().equals(request.getName()) && 
            speciesRepository.existsByName(request.getName())) {
            throw new RuntimeException("Species with name '" + request.getName() + "' already exists");
        }

        species.setName(request.getName());
        species = speciesRepository.save(species);
        
        return convertToResponse(species);
    }

    /**
     * Tür silme
     */
    public void deleteSpecies(Long id) {
        Species species = speciesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Species not found with id: " + id));

        // Hayvanları olan türü silme kontrolü
        if (!species.getAnimals().isEmpty()) {
            throw new RuntimeException("Cannot delete species that has animals. Please reassign animals first.");
        }

        speciesRepository.delete(species);
    }

    /**
     * İsmin mevcut olup olmadığını kontrol etme
     */
    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return speciesRepository.existsByName(name);
    }

    // Helper methods
    private SpeciesDto.Response convertToResponse(Species species) {
        SpeciesDto.Response response = new SpeciesDto.Response();
        response.setId(species.getId());
        response.setName(species.getName());
        response.setBreedCount(species.getBreeds().size());
        response.setAnimalCount(species.getAnimals().size());
        return response;
    }

    private SpeciesDto.Basic convertToBasic(Species species) {
        return new SpeciesDto.Basic(species.getId(), species.getName());
    }
} 