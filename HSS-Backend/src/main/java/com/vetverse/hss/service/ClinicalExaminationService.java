package com.vetverse.hss.service;

import com.vetverse.hss.dto.ClinicalExaminationDto;
import com.vetverse.hss.dto.AnimalDto;
import com.vetverse.hss.dto.OwnerDto;
import com.vetverse.hss.entity.ClinicalExamination;
import com.vetverse.hss.entity.Animal;
import com.vetverse.hss.repository.ClinicalExaminationRepository;
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
 * ClinicalExamination Service
 * ClinicalExamination entity'si için business logic katmanı
 */
@Service
@Transactional
public class ClinicalExaminationService {

    @Autowired
    private ClinicalExaminationRepository clinicalExaminationRepository;

    @Autowired
    private AnimalRepository animalRepository;

    /**
     * Tüm klinik muayeneleri listeleme
     */
    @Transactional(readOnly = true)
    public List<ClinicalExaminationDto.Response> getAllClinicalExaminations() {
        return clinicalExaminationRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sayfalanmış klinik muayene listesi
     */
    @Transactional(readOnly = true)
    public Page<ClinicalExaminationDto.Response> getAllClinicalExaminations(Pageable pageable) {
        return clinicalExaminationRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    /**
     * ID'ye göre klinik muayene bulma
     */
    @Transactional(readOnly = true)
    public Optional<ClinicalExaminationDto.Response> getClinicalExaminationById(Long id) {
        return clinicalExaminationRepository.findById(id)
                .map(this::convertToResponse);
    }

    /**
     * Hayvan ID'sine göre klinik muayeneleri listeleme
     */
    @Transactional(readOnly = true)
    public List<ClinicalExaminationDto.Response> getClinicalExaminationsByAnimalId(Long animalId) {
        return clinicalExaminationRepository.findByAnimalId(animalId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sahip ID'sine göre klinik muayeneleri listeleme
     */
    @Transactional(readOnly = true)
    public List<ClinicalExaminationDto.Response> getClinicalExaminationsByOwnerId(Long ownerId) {
        return clinicalExaminationRepository.findByOwnerId(ownerId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Veteriner adına göre klinik muayeneleri listeleme
     */
    @Transactional(readOnly = true)
    public List<ClinicalExaminationDto.Response> getClinicalExaminationsByVeterinarianName(String veterinarianName) {
        return clinicalExaminationRepository.findByVeterinarianName(veterinarianName).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Tarih aralığına göre klinik muayeneleri listeleme
     */
    @Transactional(readOnly = true)
    public List<ClinicalExaminationDto.Response> getClinicalExaminationsByDateRange(LocalDate startDate, LocalDate endDate) {
        return clinicalExaminationRepository.findByDateBetween(startDate, endDate).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Bulgular ile klinik muayene arama
     */
    @Transactional(readOnly = true)
    public List<ClinicalExaminationDto.Response> searchClinicalExaminationsByFindings(String findings) {
        return clinicalExaminationRepository.searchByFindings(findings).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Veteriner adı ile klinik muayene arama
     */
    @Transactional(readOnly = true)
    public List<ClinicalExaminationDto.Response> searchClinicalExaminationsByVeterinarianName(String veterinarianName) {
        return clinicalExaminationRepository.searchByVeterinarianName(veterinarianName).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Hayvan adı ile klinik muayene arama
     */
    @Transactional(readOnly = true)
    public List<ClinicalExaminationDto.Response> searchClinicalExaminationsByAnimalName(String animalName) {
        return clinicalExaminationRepository.searchByAnimalName(animalName).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sahip adı ile klinik muayene arama
     */
    @Transactional(readOnly = true)
    public List<ClinicalExaminationDto.Response> searchClinicalExaminationsByOwnerName(String ownerName) {
        return clinicalExaminationRepository.searchByOwnerName(ownerName).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Bugünkü klinik muayeneleri listeleme
     */
    @Transactional(readOnly = true)
    public List<ClinicalExaminationDto.Response> getTodayExaminations() {
        return clinicalExaminationRepository.findTodayExaminations().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Son 7 günde yapılan muayeneler
     */
    @Transactional(readOnly = true)
    public List<ClinicalExaminationDto.Response> getRecentExaminations() {
        LocalDate sevenDaysAgo = LocalDate.now().minusDays(7);
        return clinicalExaminationRepository.findRecentExaminations(sevenDaysAgo).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Tür ID'sine göre klinik muayeneleri listeleme
     */
    @Transactional(readOnly = true)
    public List<ClinicalExaminationDto.Response> getClinicalExaminationsBySpeciesId(Long speciesId) {
        return clinicalExaminationRepository.findBySpeciesId(speciesId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Irk ID'sine göre klinik muayeneleri listeleme
     */
    @Transactional(readOnly = true)
    public List<ClinicalExaminationDto.Response> getClinicalExaminationsByBreedId(Long breedId) {
        return clinicalExaminationRepository.findByBreedId(breedId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Belirli tarihteki muayeneleri listeleme
     */
    @Transactional(readOnly = true)
    public List<ClinicalExaminationDto.Response> getClinicalExaminationsByDate(LocalDate date) {
        return clinicalExaminationRepository.findByDate(date).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Veteriner ve tarih aralığına göre muayeneleri listeleme
     */
    @Transactional(readOnly = true)
    public List<ClinicalExaminationDto.Response> getClinicalExaminationsByVeterinarianAndDateRange(
            String veterinarianName, LocalDate startDate, LocalDate endDate) {
        return clinicalExaminationRepository.findByVeterinarianNameAndDateBetween(veterinarianName, startDate, endDate).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Veteriner bazında muayene istatistikleri
     */
    @Transactional(readOnly = true)
    public List<ClinicalExaminationDto.ExaminationStatistics> getVeterinarianExaminationStatistics() {
        List<Object[]> results = clinicalExaminationRepository.getVeterinarianExaminationStatistics();
        long totalCount = results.stream().mapToLong(result -> (Long) result[1]).sum();
        
        return results.stream()
                .map(result -> {
                    ClinicalExaminationDto.ExaminationStatistics stats = new ClinicalExaminationDto.ExaminationStatistics();
                    stats.setVeterinarianName((String) result[0]);
                    stats.setCount((Long) result[1]);
                    stats.setPercentage(totalCount > 0 ? ((Long) result[1] * 100.0 / totalCount) : 0.0);
                    return stats;
                })
                .collect(Collectors.toList());
    }

    /**
     * Basit klinik muayene listesi
     */
    @Transactional(readOnly = true)
    public List<ClinicalExaminationDto.Basic> getBasicClinicalExaminationsList() {
        return clinicalExaminationRepository.findAll().stream()
                .map(this::convertToBasic)
                .collect(Collectors.toList());
    }

    /**
     * Yeni klinik muayene oluşturma
     */
    public ClinicalExaminationDto.Response createClinicalExamination(ClinicalExaminationDto.Request request) {
        // Hayvan kontrolü
        Animal animal = animalRepository.findById(request.getAnimalId())
                .orElseThrow(() -> new RuntimeException("Animal not found with id: " + request.getAnimalId()));

        ClinicalExamination clinicalExamination = new ClinicalExamination();
        clinicalExamination.setAnimal(animal);
        clinicalExamination.setDate(request.getDate());
        clinicalExamination.setFindings(request.getFindings());
        clinicalExamination.setVeterinarianName(request.getVeterinarianName());

        clinicalExamination = clinicalExaminationRepository.save(clinicalExamination);
        return convertToResponse(clinicalExamination);
    }

    /**
     * Klinik muayene güncelleme
     */
    public ClinicalExaminationDto.Response updateClinicalExamination(Long id, ClinicalExaminationDto.Request request) {
        ClinicalExamination clinicalExamination = clinicalExaminationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Clinical examination not found with id: " + id));

        // Hayvan kontrolü
        Animal animal = animalRepository.findById(request.getAnimalId())
                .orElseThrow(() -> new RuntimeException("Animal not found with id: " + request.getAnimalId()));

        clinicalExamination.setAnimal(animal);
        clinicalExamination.setDate(request.getDate());
        clinicalExamination.setFindings(request.getFindings());
        clinicalExamination.setVeterinarianName(request.getVeterinarianName());

        clinicalExamination = clinicalExaminationRepository.save(clinicalExamination);
        return convertToResponse(clinicalExamination);
    }

    /**
     * Klinik muayene silme
     */
    public void deleteClinicalExamination(Long id) {
        ClinicalExamination clinicalExamination = clinicalExaminationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Clinical examination not found with id: " + id));

        clinicalExaminationRepository.delete(clinicalExamination);
    }

    // Helper methods
    private ClinicalExaminationDto.Response convertToResponse(ClinicalExamination clinicalExamination) {
        ClinicalExaminationDto.Response response = new ClinicalExaminationDto.Response();
        response.setId(clinicalExamination.getId());
        response.setDate(clinicalExamination.getDate());
        response.setFindings(clinicalExamination.getFindings());
        response.setVeterinarianName(clinicalExamination.getVeterinarianName());

        if (clinicalExamination.getAnimal() != null) {
            AnimalDto.Basic animalBasic = new AnimalDto.Basic(
                    clinicalExamination.getAnimal().getId(),
                    clinicalExamination.getAnimal().getName(),
                    clinicalExamination.getAnimal().getOwner() != null ? 
                        clinicalExamination.getAnimal().getOwner().getFirstName() + " " + clinicalExamination.getAnimal().getOwner().getLastName() : "",
                    clinicalExamination.getAnimal().getSpecies() != null ? clinicalExamination.getAnimal().getSpecies().getName() : ""
            );
            animalBasic.setBreedName(clinicalExamination.getAnimal().getBreed() != null ? clinicalExamination.getAnimal().getBreed().getName() : "");
            animalBasic.setMicrochipNumber(clinicalExamination.getAnimal().getMicrochipNumber());
            response.setAnimal(animalBasic);

            if (clinicalExamination.getAnimal().getOwner() != null) {
                response.setOwner(new OwnerDto.Basic(
                        clinicalExamination.getAnimal().getOwner().getId(),
                        clinicalExamination.getAnimal().getOwner().getFirstName(),
                        clinicalExamination.getAnimal().getOwner().getLastName(),
                        clinicalExamination.getAnimal().getOwner().getPhone(),
                        clinicalExamination.getAnimal().getOwner().getEmail()
                ));
            }
        }

        return response;
    }

    private ClinicalExaminationDto.Basic convertToBasic(ClinicalExamination clinicalExamination) {
        String shortFindings = clinicalExamination.getFindings() != null && clinicalExamination.getFindings().length() > 100 
                ? clinicalExamination.getFindings().substring(0, 100) + "..." 
                : clinicalExamination.getFindings();
        
        ClinicalExaminationDto.Basic basic = new ClinicalExaminationDto.Basic(
                clinicalExamination.getId(),
                clinicalExamination.getAnimal() != null ? clinicalExamination.getAnimal().getName() : "",
                clinicalExamination.getAnimal() != null && clinicalExamination.getAnimal().getOwner() != null ? 
                    clinicalExamination.getAnimal().getOwner().getFirstName() + " " + clinicalExamination.getAnimal().getOwner().getLastName() : "",
                clinicalExamination.getDate(),
                clinicalExamination.getVeterinarianName()
        );
        basic.setShortFindings(shortFindings);
        return basic;
    }
} 