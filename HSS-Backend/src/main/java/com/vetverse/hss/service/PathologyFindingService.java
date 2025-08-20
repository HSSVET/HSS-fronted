package com.vetverse.hss.service;

import com.vetverse.hss.dto.PathologyFindingDto;
import com.vetverse.hss.dto.AnimalDto;
import com.vetverse.hss.dto.OwnerDto;
import com.vetverse.hss.entity.PathologyFinding;
import com.vetverse.hss.entity.Animal;
import com.vetverse.hss.repository.PathologyFindingRepository;
import com.vetverse.hss.repository.AnimalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * PathologyFinding Service
 * PathologyFinding entity'si için business logic katmanı
 */
@Service
@Transactional
public class PathologyFindingService {

    @Autowired
    private PathologyFindingRepository pathologyFindingRepository;

    @Autowired
    private AnimalRepository animalRepository;

    /**
     * Tüm patoloji bulgularını listeleme
     */
    @Transactional(readOnly = true)
    public List<PathologyFindingDto.Response> getAllPathologyFindings() {
        return pathologyFindingRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sayfalanmış patoloji bulgusu listesi
     */
    @Transactional(readOnly = true)
    public Page<PathologyFindingDto.Response> getAllPathologyFindings(Pageable pageable) {
        return pathologyFindingRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    /**
     * ID'ye göre patoloji bulgusu bulma
     */
    @Transactional(readOnly = true)
    public Optional<PathologyFindingDto.Response> getPathologyFindingById(Long id) {
        return pathologyFindingRepository.findById(id)
                .map(this::convertToResponse);
    }

    /**
     * Hayvan ID'sine göre patoloji bulgularını listeleme
     */
    @Transactional(readOnly = true)
    public List<PathologyFindingDto.Response> getPathologyFindingsByAnimalId(Long animalId) {
        return pathologyFindingRepository.findByAnimalId(animalId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sahip ID'sine göre patoloji bulgularını listeleme
     */
    @Transactional(readOnly = true)
    public List<PathologyFindingDto.Response> getPathologyFindingsByOwnerId(Long ownerId) {
        return pathologyFindingRepository.findByOwnerId(ownerId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Tarih aralığına göre patoloji bulgularını listeleme
     */
    @Transactional(readOnly = true)
    public List<PathologyFindingDto.Response> getPathologyFindingsByDateRange(LocalDate startDate, LocalDate endDate) {
        return pathologyFindingRepository.findByDateBetween(startDate, endDate).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Rapor ile patoloji bulgusu arama
     */
    @Transactional(readOnly = true)
    public List<PathologyFindingDto.Response> searchPathologyFindingsByReport(String report) {
        return pathologyFindingRepository.searchByReport(report).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Hayvan adı ile patoloji bulgusu arama
     */
    @Transactional(readOnly = true)
    public List<PathologyFindingDto.Response> searchPathologyFindingsByAnimalName(String animalName) {
        return pathologyFindingRepository.searchByAnimalName(animalName).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sahip adı ile patoloji bulgusu arama
     */
    @Transactional(readOnly = true)
    public List<PathologyFindingDto.Response> searchPathologyFindingsByOwnerName(String ownerName) {
        return pathologyFindingRepository.searchByOwnerName(ownerName).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Bugünkü patoloji bulgularını listeleme
     */
    @Transactional(readOnly = true)
    public List<PathologyFindingDto.Response> getTodayFindings() {
        return pathologyFindingRepository.findTodayFindings().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Son 30 günde eklenen patoloji bulguları
     */
    @Transactional(readOnly = true)
    public List<PathologyFindingDto.Response> getRecentFindings() {
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        return pathologyFindingRepository.findRecentFindings(thirtyDaysAgo).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Tür ID'sine göre patoloji bulgularını listeleme
     */
    @Transactional(readOnly = true)
    public List<PathologyFindingDto.Response> getPathologyFindingsBySpeciesId(Long speciesId) {
        return pathologyFindingRepository.findBySpeciesId(speciesId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Irk ID'sine göre patoloji bulgularını listeleme
     */
    @Transactional(readOnly = true)
    public List<PathologyFindingDto.Response> getPathologyFindingsByBreedId(Long breedId) {
        return pathologyFindingRepository.findByBreedId(breedId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Belirli tarihteki patoloji bulgularını listeleme
     */
    @Transactional(readOnly = true)
    public List<PathologyFindingDto.Response> getPathologyFindingsByDate(LocalDate date) {
        return pathologyFindingRepository.findByDate(date).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Basit patoloji bulgusu listesi
     */
    @Transactional(readOnly = true)
    public List<PathologyFindingDto.Basic> getBasicPathologyFindingsList() {
        return pathologyFindingRepository.findAll().stream()
                .map(this::convertToBasic)
                .collect(Collectors.toList());
    }

    /**
     * Yeni patoloji bulgusu oluşturma
     */
    public PathologyFindingDto.Response createPathologyFinding(PathologyFindingDto.Request request) {
        // Hayvan kontrolü
        Animal animal = animalRepository.findById(request.getAnimalId())
                .orElseThrow(() -> new RuntimeException("Animal not found with id: " + request.getAnimalId()));

        PathologyFinding pathologyFinding = new PathologyFinding();
        pathologyFinding.setAnimal(animal);
        pathologyFinding.setDate(request.getDate());
        pathologyFinding.setReport(request.getReport());

        pathologyFinding = pathologyFindingRepository.save(pathologyFinding);
        return convertToResponse(pathologyFinding);
    }

    /**
     * Patoloji bulgusu güncelleme
     */
    public PathologyFindingDto.Response updatePathologyFinding(Long id, PathologyFindingDto.Request request) {
        PathologyFinding pathologyFinding = pathologyFindingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pathology finding not found with id: " + id));

        // Hayvan kontrolü
        Animal animal = animalRepository.findById(request.getAnimalId())
                .orElseThrow(() -> new RuntimeException("Animal not found with id: " + request.getAnimalId()));

        pathologyFinding.setAnimal(animal);
        pathologyFinding.setDate(request.getDate());
        pathologyFinding.setReport(request.getReport());

        pathologyFinding = pathologyFindingRepository.save(pathologyFinding);
        return convertToResponse(pathologyFinding);
    }

    /**
     * Patoloji bulgusu silme
     */
    public void deletePathologyFinding(Long id) {
        PathologyFinding pathologyFinding = pathologyFindingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pathology finding not found with id: " + id));

        pathologyFindingRepository.delete(pathologyFinding);
    }

    // Helper methods
    private PathologyFindingDto.Response convertToResponse(PathologyFinding pathologyFinding) {
        PathologyFindingDto.Response response = new PathologyFindingDto.Response();
        response.setId(pathologyFinding.getId());
        response.setDate(pathologyFinding.getDate());
        response.setReport(pathologyFinding.getReport());

        // Frontend için gerekli olan ekstra alanları doldur
        response.setReportNo("2025-PAT-" + String.format("%04d", pathologyFinding.getId()));
        response.setPathologist("AHMET YILDIZ"); // Sabit değer, gerçek uygulamada dinamik olabilir
        response.setSampleNo("S-2025-" + String.format("%03d", pathologyFinding.getId()));
        response.setSampleType("DOKU BİYOPSİSİ"); // Sabit değer
        response.setLocation("GENEL"); // Sabit değer

        if (pathologyFinding.getAnimal() != null) {
            AnimalDto.Basic animalBasic = new AnimalDto.Basic(
                    pathologyFinding.getAnimal().getId(),
                    pathologyFinding.getAnimal().getName(),
                    pathologyFinding.getAnimal().getOwner() != null ? 
                        pathologyFinding.getAnimal().getOwner().getFirstName() + " " + pathologyFinding.getAnimal().getOwner().getLastName() : "",
                    pathologyFinding.getAnimal().getSpecies() != null ? pathologyFinding.getAnimal().getSpecies().getName() : ""
            );
            animalBasic.setBreedName(pathologyFinding.getAnimal().getBreed() != null ? pathologyFinding.getAnimal().getBreed().getName() : "");
            animalBasic.setMicrochipNumber(pathologyFinding.getAnimal().getMicrochipNumber());
            response.setAnimal(animalBasic);

            if (pathologyFinding.getAnimal().getOwner() != null) {
                response.setOwner(new OwnerDto.Basic(
                        pathologyFinding.getAnimal().getOwner().getId(),
                        pathologyFinding.getAnimal().getOwner().getFirstName(),
                        pathologyFinding.getAnimal().getOwner().getLastName(),
                        pathologyFinding.getAnimal().getOwner().getPhone(),
                        pathologyFinding.getAnimal().getOwner().getEmail()
                ));
            }
        }

        return response;
    }

    private PathologyFindingDto.Basic convertToBasic(PathologyFinding pathologyFinding) {
        String shortReport = pathologyFinding.getReport() != null && pathologyFinding.getReport().length() > 200 
                ? pathologyFinding.getReport().substring(0, 200) + "..." 
                : pathologyFinding.getReport();
        
        PathologyFindingDto.Basic basic = new PathologyFindingDto.Basic(
                pathologyFinding.getId(),
                pathologyFinding.getAnimal() != null ? pathologyFinding.getAnimal().getName() : "",
                pathologyFinding.getAnimal() != null && pathologyFinding.getAnimal().getOwner() != null ? 
                    pathologyFinding.getAnimal().getOwner().getFirstName() + " " + pathologyFinding.getAnimal().getOwner().getLastName() : "",
                pathologyFinding.getDate(),
                "2025-PAT-" + String.format("%04d", pathologyFinding.getId())
        );
        basic.setShortReport(shortReport);
        return basic;
    }
} 