package com.vetverse.hss.service;

import com.vetverse.hss.dto.LabTestDto;
import com.vetverse.hss.dto.LabResultDto;
import com.vetverse.hss.dto.AnimalDto;
import com.vetverse.hss.dto.OwnerDto;
import com.vetverse.hss.entity.LabTest;
import com.vetverse.hss.entity.LabResult;
import com.vetverse.hss.entity.Animal;
import com.vetverse.hss.repository.LabTestRepository;
import com.vetverse.hss.repository.LabResultRepository;
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
 * LabTest Service
 * LabTest entity'si için business logic katmanı
 */
@Service
@Transactional
public class LabTestService {

    @Autowired
    private LabTestRepository labTestRepository;

    @Autowired
    private LabResultRepository labResultRepository;

    @Autowired
    private AnimalRepository animalRepository;

    /**
     * Tüm lab testlerini listeleme
     */
    @Transactional(readOnly = true)
    public List<LabTestDto.Response> getAllLabTests() {
        return labTestRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sayfalanmış lab test listesi
     */
    @Transactional(readOnly = true)
    public Page<LabTestDto.Response> getAllLabTests(Pageable pageable) {
        return labTestRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    /**
     * ID'ye göre lab test bulma
     */
    @Transactional(readOnly = true)
    public Optional<LabTestDto.Response> getLabTestById(Long id) {
        return labTestRepository.findById(id)
                .map(this::convertToResponse);
    }

    /**
     * Hayvan ID'sine göre lab testlerini listeleme
     */
    @Transactional(readOnly = true)
    public List<LabTestDto.Response> getLabTestsByAnimalId(Long animalId) {
        return labTestRepository.findByAnimalId(animalId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Test adına göre lab testlerini listeleme
     */
    @Transactional(readOnly = true)
    public List<LabTestDto.Response> getLabTestsByTestName(String testName) {
        return labTestRepository.findByTestName(testName).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sahip ID'sine göre lab testlerini listeleme
     */
    @Transactional(readOnly = true)
    public List<LabTestDto.Response> getLabTestsByOwnerId(Long ownerId) {
        return labTestRepository.findByOwnerId(ownerId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Tarih aralığına göre lab testlerini listeleme
     */
    @Transactional(readOnly = true)
    public List<LabTestDto.Response> getLabTestsByDateRange(LocalDate startDate, LocalDate endDate) {
        return labTestRepository.findByDateBetween(startDate, endDate).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Test adı ile lab test arama
     */
    @Transactional(readOnly = true)
    public List<LabTestDto.Response> searchLabTestsByTestName(String testName) {
        return labTestRepository.searchByTestName(testName).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Hayvan adı ile lab test arama
     */
    @Transactional(readOnly = true)
    public List<LabTestDto.Response> searchLabTestsByAnimalName(String animalName) {
        return labTestRepository.searchByAnimalName(animalName).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sahip adı ile lab test arama
     */
    @Transactional(readOnly = true)
    public List<LabTestDto.Response> searchLabTestsByOwnerName(String ownerName) {
        return labTestRepository.searchByOwnerName(ownerName).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Bugünkü lab testlerini listeleme
     */
    @Transactional(readOnly = true)
    public List<LabTestDto.Response> getTodayTests() {
        return labTestRepository.findTodayTests().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Bekleyen testler (sonucu olmayan)
     */
    @Transactional(readOnly = true)
    public List<LabTestDto.Response> getPendingTests() {
        return labTestRepository.findPendingTests().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Tamamlanan testler (sonucu olan)
     */
    @Transactional(readOnly = true)
    public List<LabTestDto.Response> getCompletedTests() {
        return labTestRepository.findCompletedTests().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Son 30 günde yapılan testler
     */
    @Transactional(readOnly = true)
    public List<LabTestDto.Response> getRecentTests() {
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        return labTestRepository.findRecentTests(thirtyDaysAgo).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Tür ID'sine göre lab testlerini listeleme
     */
    @Transactional(readOnly = true)
    public List<LabTestDto.Response> getLabTestsBySpeciesId(Long speciesId) {
        return labTestRepository.findBySpeciesId(speciesId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Irk ID'sine göre lab testlerini listeleme
     */
    @Transactional(readOnly = true)
    public List<LabTestDto.Response> getLabTestsByBreedId(Long breedId) {
        return labTestRepository.findByBreedId(breedId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Belirli tarihteki testleri listeleme
     */
    @Transactional(readOnly = true)
    public List<LabTestDto.Response> getLabTestsByDate(LocalDate date) {
        return labTestRepository.findByDate(date).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Test adı ve tarih aralığına göre testleri listeleme
     */
    @Transactional(readOnly = true)
    public List<LabTestDto.Response> getLabTestsByTestNameAndDateRange(
            String testName, LocalDate startDate, LocalDate endDate) {
        return labTestRepository.findByTestNameAndDateBetween(testName, startDate, endDate).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Test türü istatistikleri
     */
    @Transactional(readOnly = true)
    public List<LabTestDto.TestStatistics> getTestTypeStatistics() {
        List<Object[]> results = labTestRepository.getTestTypeStatistics();
        long totalCount = results.stream().mapToLong(result -> (Long) result[1]).sum();
        
        return results.stream()
                .map(result -> {
                    LabTestDto.TestStatistics stats = new LabTestDto.TestStatistics();
                    stats.setTestName((String) result[0]);
                    stats.setCount((Long) result[1]);
                    stats.setPercentage(totalCount > 0 ? ((Long) result[1] * 100.0 / totalCount) : 0.0);
                    return stats;
                })
                .collect(Collectors.toList());
    }

    /**
     * Basit lab test listesi
     */
    @Transactional(readOnly = true)
    public List<LabTestDto.Basic> getBasicLabTestsList() {
        return labTestRepository.findAll().stream()
                .map(this::convertToBasic)
                .collect(Collectors.toList());
    }

    /**
     * Yeni lab test oluşturma
     */
    public LabTestDto.Response createLabTest(LabTestDto.Request request) {
        // Hayvan kontrolü
        Animal animal = animalRepository.findById(request.getAnimalId())
                .orElseThrow(() -> new RuntimeException("Animal not found with id: " + request.getAnimalId()));

        LabTest labTest = new LabTest();
        labTest.setAnimal(animal);
        labTest.setTestName(request.getTestName());
        labTest.setDate(request.getDate());

        labTest = labTestRepository.save(labTest);
        return convertToResponse(labTest);
    }

    /**
     * Lab test güncelleme
     */
    public LabTestDto.Response updateLabTest(Long id, LabTestDto.Request request) {
        LabTest labTest = labTestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lab test not found with id: " + id));

        // Hayvan kontrolü
        Animal animal = animalRepository.findById(request.getAnimalId())
                .orElseThrow(() -> new RuntimeException("Animal not found with id: " + request.getAnimalId()));

        labTest.setAnimal(animal);
        labTest.setTestName(request.getTestName());
        labTest.setDate(request.getDate());

        labTest = labTestRepository.save(labTest);
        return convertToResponse(labTest);
    }

    /**
     * Lab test silme
     */
    public void deleteLabTest(Long id) {
        LabTest labTest = labTestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lab test not found with id: " + id));

        labTestRepository.delete(labTest);
    }

    // Helper methods
    private LabTestDto.Response convertToResponse(LabTest labTest) {
        LabTestDto.Response response = new LabTestDto.Response();
        response.setId(labTest.getId());
        response.setTestName(labTest.getTestName());
        response.setDate(labTest.getDate());

        // Lab results'ları ekle
        if (labTest.getLabResults() != null) {
            List<LabResultDto.Response> labResults = labTest.getLabResults().stream()
                    .map(this::convertLabResultToResponse)
                    .collect(Collectors.toList());
            response.setLabResults(labResults);
        }

        // Status belirleme
        response.setStatus(labTest.getLabResults() != null && !labTest.getLabResults().isEmpty() ? "COMPLETED" : "PENDING");

        if (labTest.getAnimal() != null) {
            AnimalDto.Basic animalBasic = new AnimalDto.Basic(
                    labTest.getAnimal().getId(),
                    labTest.getAnimal().getName(),
                    labTest.getAnimal().getOwner() != null ? 
                        labTest.getAnimal().getOwner().getFirstName() + " " + labTest.getAnimal().getOwner().getLastName() : "",
                    labTest.getAnimal().getSpecies() != null ? labTest.getAnimal().getSpecies().getName() : ""
            );
            animalBasic.setBreedName(labTest.getAnimal().getBreed() != null ? labTest.getAnimal().getBreed().getName() : "");
            animalBasic.setMicrochipNumber(labTest.getAnimal().getMicrochipNumber());
            response.setAnimal(animalBasic);

            if (labTest.getAnimal().getOwner() != null) {
                response.setOwner(new OwnerDto.Basic(
                        labTest.getAnimal().getOwner().getId(),
                        labTest.getAnimal().getOwner().getFirstName(),
                        labTest.getAnimal().getOwner().getLastName(),
                        labTest.getAnimal().getOwner().getPhone(),
                        labTest.getAnimal().getOwner().getEmail()
                ));
            }
        }

        return response;
    }

    private LabTestDto.Basic convertToBasic(LabTest labTest) {
        LabTestDto.Basic basic = new LabTestDto.Basic(
                labTest.getId(),
                labTest.getAnimal() != null ? labTest.getAnimal().getName() : "",
                labTest.getAnimal() != null && labTest.getAnimal().getOwner() != null ? 
                    labTest.getAnimal().getOwner().getFirstName() + " " + labTest.getAnimal().getOwner().getLastName() : "",
                labTest.getTestName(),
                labTest.getDate()
        );
        basic.setStatus(labTest.getLabResults() != null && !labTest.getLabResults().isEmpty() ? "COMPLETED" : "PENDING");
        return basic;
    }

    private LabResultDto.Response convertLabResultToResponse(LabResult labResult) {
        LabResultDto.Response response = new LabResultDto.Response();
        response.setId(labResult.getId());
        response.setResult(labResult.getResult());
        response.setValue(labResult.getValue());
        response.setUnit(labResult.getUnit());
        
        // Status belirleme (basit bir mantık)
        if (labResult.getResult() != null) {
            String result = labResult.getResult().toLowerCase();
            if (result.contains("normal") || result.contains("negatif")) {
                response.setStatus("NORMAL");
            } else if (result.contains("yüksek") || result.contains("high")) {
                response.setStatus("HIGH");
            } else if (result.contains("düşük") || result.contains("low")) {
                response.setStatus("LOW");
            } else if (result.contains("anormal") || result.contains("pozitif")) {
                response.setStatus("ABNORMAL");
            }
        }
        
        return response;
    }
} 