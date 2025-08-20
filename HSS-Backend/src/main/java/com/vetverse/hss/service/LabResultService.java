package com.vetverse.hss.service;

import com.vetverse.hss.dto.LabResultDto;
import com.vetverse.hss.entity.LabResult;
import com.vetverse.hss.entity.LabTest;
import com.vetverse.hss.repository.LabResultRepository;
import com.vetverse.hss.repository.LabTestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * LabResult Service
 * LabResult entity'si için business logic katmanı
 */
@Service
@Transactional
public class LabResultService {

    @Autowired
    private LabResultRepository labResultRepository;

    @Autowired
    private LabTestRepository labTestRepository;

    /**
     * Tüm lab sonuçlarını listeleme
     */
    @Transactional(readOnly = true)
    public List<LabResultDto.Response> getAllLabResults() {
        return labResultRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sayfalanmış lab sonuç listesi
     */
    @Transactional(readOnly = true)
    public Page<LabResultDto.Response> getAllLabResults(Pageable pageable) {
        return labResultRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    /**
     * ID'ye göre lab sonucu bulma
     */
    @Transactional(readOnly = true)
    public Optional<LabResultDto.Response> getLabResultById(Long id) {
        return labResultRepository.findById(id)
                .map(this::convertToResponse);
    }

    /**
     * Lab test ID'sine göre sonuçları listeleme
     */
    @Transactional(readOnly = true)
    public List<LabResultDto.Response> getLabResultsByLabTestId(Long labTestId) {
        return labResultRepository.findByLabTestId(labTestId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Hayvan ID'sine göre tüm lab sonuçları
     */
    @Transactional(readOnly = true)
    public List<LabResultDto.Response> getLabResultsByAnimalId(Long animalId) {
        return labResultRepository.findByAnimalId(animalId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Test adına göre sonuçları listeleme
     */
    @Transactional(readOnly = true)
    public List<LabResultDto.Response> getLabResultsByTestName(String testName) {
        return labResultRepository.findByTestName(testName).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Hayvan ve test adına göre sonuçları listeleme
     */
    @Transactional(readOnly = true)
    public List<LabResultDto.Response> getLabResultsByAnimalIdAndTestName(Long animalId, String testName) {
        return labResultRepository.findByAnimalIdAndTestName(animalId, testName).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sahip ID'sine göre tüm hayvanların lab sonuçları
     */
    @Transactional(readOnly = true)
    public List<LabResultDto.Response> getLabResultsByOwnerId(Long ownerId) {
        return labResultRepository.findByOwnerId(ownerId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Tür ID'sine göre lab sonuçları
     */
    @Transactional(readOnly = true)
    public List<LabResultDto.Response> getLabResultsBySpeciesId(Long speciesId) {
        return labResultRepository.findBySpeciesId(speciesId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Irk ID'sine göre lab sonuçları
     */
    @Transactional(readOnly = true)
    public List<LabResultDto.Response> getLabResultsByBreedId(Long breedId) {
        return labResultRepository.findByBreedId(breedId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sonuç değeri ile arama
     */
    @Transactional(readOnly = true)
    public List<LabResultDto.Response> searchLabResultsByResult(String result) {
        return labResultRepository.searchByResult(result).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Değer ile arama
     */
    @Transactional(readOnly = true)
    public List<LabResultDto.Response> searchLabResultsByValue(String value) {
        return labResultRepository.searchByValue(value).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Birim ile arama
     */
    @Transactional(readOnly = true)
    public List<LabResultDto.Response> searchLabResultsByUnit(String unit) {
        return labResultRepository.searchByUnit(unit).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Belirli birim türüne sahip sonuçlar
     */
    @Transactional(readOnly = true)
    public List<LabResultDto.Response> getLabResultsByUnit(String unit) {
        return labResultRepository.findByUnit(unit).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Anormal sonuçlar
     */
    @Transactional(readOnly = true)
    public List<LabResultDto.Response> getAbnormalResults() {
        return labResultRepository.findAbnormalResults().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Normal sonuçlar
     */
    @Transactional(readOnly = true)
    public List<LabResultDto.Response> getNormalResults() {
        return labResultRepository.findNormalResults().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Boş olmayan değere sahip sonuçlar
     */
    @Transactional(readOnly = true)
    public List<LabResultDto.Response> getResultsWithValues() {
        return labResultRepository.findResultsWithValues().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Test türü ve sonuç istatistikleri
     */
    @Transactional(readOnly = true)
    public List<Object[]> getTestResultStatistics() {
        return labResultRepository.getTestResultStatistics();
    }

    /**
     * Yeni lab sonucu oluşturma
     */
    public LabResultDto.Response createLabResult(LabResultDto.Request request) {
        // Lab test kontrolü
        LabTest labTest = labTestRepository.findById(request.getLabTestId())
                .orElseThrow(() -> new RuntimeException("Lab test not found with id: " + request.getLabTestId()));

        LabResult labResult = new LabResult();
        labResult.setLabTest(labTest);
        labResult.setResult(request.getResult());
        labResult.setValue(request.getValue());
        labResult.setUnit(request.getUnit());

        labResult = labResultRepository.save(labResult);
        return convertToResponse(labResult);
    }

    /**
     * Lab sonucu güncelleme
     */
    public LabResultDto.Response updateLabResult(Long id, LabResultDto.Request request) {
        LabResult labResult = labResultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lab result not found with id: " + id));

        // Lab test kontrolü
        LabTest labTest = labTestRepository.findById(request.getLabTestId())
                .orElseThrow(() -> new RuntimeException("Lab test not found with id: " + request.getLabTestId()));

        labResult.setLabTest(labTest);
        labResult.setResult(request.getResult());
        labResult.setValue(request.getValue());
        labResult.setUnit(request.getUnit());

        labResult = labResultRepository.save(labResult);
        return convertToResponse(labResult);
    }

    /**
     * Lab sonucu silme
     */
    public void deleteLabResult(Long id) {
        LabResult labResult = labResultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lab result not found with id: " + id));

        labResultRepository.delete(labResult);
    }

    // Helper methods
    private LabResultDto.Response convertToResponse(LabResult labResult) {
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