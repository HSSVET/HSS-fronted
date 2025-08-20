package com.vetverse.hss.service;

import com.vetverse.hss.dto.DiseaseHistoryDto;
import com.vetverse.hss.dto.AnimalDto;
import com.vetverse.hss.dto.OwnerDto;
import com.vetverse.hss.entity.DiseaseHistory;
import com.vetverse.hss.entity.Animal;
import com.vetverse.hss.repository.DiseaseHistoryRepository;
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
 * DiseaseHistory Service
 * DiseaseHistory entity'si için business logic katmanı
 */
@Service
@Transactional
public class DiseaseHistoryService {

    @Autowired
    private DiseaseHistoryRepository diseaseHistoryRepository;

    @Autowired
    private AnimalRepository animalRepository;

    /**
     * Tüm hastalık geçmişlerini listeleme
     */
    @Transactional(readOnly = true)
    public List<DiseaseHistoryDto.Response> getAllDiseaseHistories() {
        return diseaseHistoryRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sayfalanmış hastalık geçmişi listesi
     */
    @Transactional(readOnly = true)
    public Page<DiseaseHistoryDto.Response> getAllDiseaseHistories(Pageable pageable) {
        return diseaseHistoryRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    /**
     * ID'ye göre hastalık geçmişi bulma
     */
    @Transactional(readOnly = true)
    public Optional<DiseaseHistoryDto.Response> getDiseaseHistoryById(Long id) {
        return diseaseHistoryRepository.findById(id)
                .map(this::convertToResponse);
    }

    /**
     * Hayvan ID'sine göre hastalık geçmişlerini listeleme
     */
    @Transactional(readOnly = true)
    public List<DiseaseHistoryDto.Response> getDiseaseHistoriesByAnimalId(Long animalId) {
        return diseaseHistoryRepository.findByAnimalId(animalId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sahip ID'sine göre hastalık geçmişlerini listeleme
     */
    @Transactional(readOnly = true)
    public List<DiseaseHistoryDto.Response> getDiseaseHistoriesByOwnerId(Long ownerId) {
        return diseaseHistoryRepository.findByOwnerId(ownerId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Tarih aralığına göre hastalık geçmişlerini listeleme
     */
    @Transactional(readOnly = true)
    public List<DiseaseHistoryDto.Response> getDiseaseHistoriesByDateRange(LocalDate startDate, LocalDate endDate) {
        return diseaseHistoryRepository.findByDateBetween(startDate, endDate).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Tanı ile hastalık geçmişi arama
     */
    @Transactional(readOnly = true)
    public List<DiseaseHistoryDto.Response> searchDiseaseHistoriesByDiagnosis(String diagnosis) {
        return diseaseHistoryRepository.searchByDiagnosis(diagnosis).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Tedavi ile hastalık geçmişi arama
     */
    @Transactional(readOnly = true)
    public List<DiseaseHistoryDto.Response> searchDiseaseHistoriesByTreatment(String treatment) {
        return diseaseHistoryRepository.searchByTreatment(treatment).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Hayvan adı ile hastalık geçmişi arama
     */
    @Transactional(readOnly = true)
    public List<DiseaseHistoryDto.Response> searchDiseaseHistoriesByAnimalName(String animalName) {
        return diseaseHistoryRepository.searchByAnimalName(animalName).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sahip adı ile hastalık geçmişi arama
     */
    @Transactional(readOnly = true)
    public List<DiseaseHistoryDto.Response> searchDiseaseHistoriesByOwnerName(String ownerName) {
        return diseaseHistoryRepository.searchByOwnerName(ownerName).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Son 30 günde eklenen hastalık kayıtları
     */
    @Transactional(readOnly = true)
    public List<DiseaseHistoryDto.Response> getRecentDiseaseHistories() {
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        return diseaseHistoryRepository.findRecentDiseaseHistory(thirtyDaysAgo).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Tür ID'sine göre hastalık geçmişlerini listeleme
     */
    @Transactional(readOnly = true)
    public List<DiseaseHistoryDto.Response> getDiseaseHistoriesBySpeciesId(Long speciesId) {
        return diseaseHistoryRepository.findBySpeciesId(speciesId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Irk ID'sine göre hastalık geçmişlerini listeleme
     */
    @Transactional(readOnly = true)
    public List<DiseaseHistoryDto.Response> getDiseaseHistoriesByBreedId(Long breedId) {
        return diseaseHistoryRepository.findByBreedId(breedId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Hastalık istatistikleri
     */
    @Transactional(readOnly = true)
    public List<DiseaseHistoryDto.DiagnosisStatistics> getDiagnosisStatistics() {
        List<Object[]> results = diseaseHistoryRepository.getDiagnosisStatistics();
        long totalCount = results.stream().mapToLong(result -> (Long) result[1]).sum();
        
        return results.stream()
                .map(result -> {
                    DiseaseHistoryDto.DiagnosisStatistics stats = new DiseaseHistoryDto.DiagnosisStatistics();
                    stats.setDiagnosis((String) result[0]);
                    stats.setCount((Long) result[1]);
                    stats.setPercentage(totalCount > 0 ? ((Long) result[1] * 100.0 / totalCount) : 0.0);
                    return stats;
                })
                .collect(Collectors.toList());
    }

    /**
     * Basit hastalık geçmişi listesi
     */
    @Transactional(readOnly = true)
    public List<DiseaseHistoryDto.Basic> getBasicDiseaseHistoriesList() {
        return diseaseHistoryRepository.findAll().stream()
                .map(this::convertToBasic)
                .collect(Collectors.toList());
    }

    /**
     * Yeni hastalık geçmişi oluşturma
     */
    public DiseaseHistoryDto.Response createDiseaseHistory(DiseaseHistoryDto.Request request) {
        // Hayvan kontrolü
        Animal animal = animalRepository.findById(request.getAnimalId())
                .orElseThrow(() -> new RuntimeException("Animal not found with id: " + request.getAnimalId()));

        DiseaseHistory diseaseHistory = new DiseaseHistory();
        diseaseHistory.setAnimal(animal);
        diseaseHistory.setDate(request.getDate());
        diseaseHistory.setDiagnosis(request.getDiagnosis());
        diseaseHistory.setTreatment(request.getTreatment());

        diseaseHistory = diseaseHistoryRepository.save(diseaseHistory);
        return convertToResponse(diseaseHistory);
    }

    /**
     * Hastalık geçmişi güncelleme
     */
    public DiseaseHistoryDto.Response updateDiseaseHistory(Long id, DiseaseHistoryDto.Request request) {
        DiseaseHistory diseaseHistory = diseaseHistoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disease history not found with id: " + id));

        // Hayvan kontrolü
        Animal animal = animalRepository.findById(request.getAnimalId())
                .orElseThrow(() -> new RuntimeException("Animal not found with id: " + request.getAnimalId()));

        diseaseHistory.setAnimal(animal);
        diseaseHistory.setDate(request.getDate());
        diseaseHistory.setDiagnosis(request.getDiagnosis());
        diseaseHistory.setTreatment(request.getTreatment());

        diseaseHistory = diseaseHistoryRepository.save(diseaseHistory);
        return convertToResponse(diseaseHistory);
    }

    /**
     * Hastalık geçmişi silme
     */
    public void deleteDiseaseHistory(Long id) {
        DiseaseHistory diseaseHistory = diseaseHistoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disease history not found with id: " + id));

        diseaseHistoryRepository.delete(diseaseHistory);
    }

    // Helper methods
    private DiseaseHistoryDto.Response convertToResponse(DiseaseHistory diseaseHistory) {
        DiseaseHistoryDto.Response response = new DiseaseHistoryDto.Response();
        response.setId(diseaseHistory.getId());
        response.setDate(diseaseHistory.getDate());
        response.setDiagnosis(diseaseHistory.getDiagnosis());
        response.setTreatment(diseaseHistory.getTreatment());

        if (diseaseHistory.getAnimal() != null) {
            AnimalDto.Basic animalBasic = new AnimalDto.Basic(
                    diseaseHistory.getAnimal().getId(),
                    diseaseHistory.getAnimal().getName(),
                    diseaseHistory.getAnimal().getOwner() != null ? 
                        diseaseHistory.getAnimal().getOwner().getFirstName() + " " + diseaseHistory.getAnimal().getOwner().getLastName() : "",
                    diseaseHistory.getAnimal().getSpecies() != null ? diseaseHistory.getAnimal().getSpecies().getName() : ""
            );
            animalBasic.setBreedName(diseaseHistory.getAnimal().getBreed() != null ? diseaseHistory.getAnimal().getBreed().getName() : "");
            animalBasic.setMicrochipNumber(diseaseHistory.getAnimal().getMicrochipNumber());
            response.setAnimal(animalBasic);

            if (diseaseHistory.getAnimal().getOwner() != null) {
                response.setOwner(new OwnerDto.Basic(
                        diseaseHistory.getAnimal().getOwner().getId(),
                        diseaseHistory.getAnimal().getOwner().getFirstName(),
                        diseaseHistory.getAnimal().getOwner().getLastName(),
                        diseaseHistory.getAnimal().getOwner().getPhone(),
                        diseaseHistory.getAnimal().getOwner().getEmail()
                ));
            }
        }

        return response;
    }

    private DiseaseHistoryDto.Basic convertToBasic(DiseaseHistory diseaseHistory) {
        String shortTreatment = diseaseHistory.getTreatment() != null && diseaseHistory.getTreatment().length() > 100 
                ? diseaseHistory.getTreatment().substring(0, 100) + "..." 
                : diseaseHistory.getTreatment();
        
        DiseaseHistoryDto.Basic basic = new DiseaseHistoryDto.Basic(
                diseaseHistory.getId(),
                diseaseHistory.getAnimal() != null ? diseaseHistory.getAnimal().getName() : "",
                diseaseHistory.getAnimal() != null && diseaseHistory.getAnimal().getOwner() != null ? 
                    diseaseHistory.getAnimal().getOwner().getFirstName() + " " + diseaseHistory.getAnimal().getOwner().getLastName() : "",
                diseaseHistory.getDate(),
                diseaseHistory.getDiagnosis()
        );
        basic.setShortTreatment(shortTreatment);
        return basic;
    }
} 