package com.vetverse.hss.service;

import com.vetverse.hss.dto.RadiologicalImagingDto;
import com.vetverse.hss.dto.AnimalDto;
import com.vetverse.hss.dto.OwnerDto;
import com.vetverse.hss.entity.RadiologicalImaging;
import com.vetverse.hss.entity.Animal;
import com.vetverse.hss.repository.RadiologicalImagingRepository;
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
 * RadiologicalImaging Service
 * RadiologicalImaging entity'si için business logic katmanı
 */
@Service
@Transactional
public class RadiologicalImagingService {

    @Autowired
    private RadiologicalImagingRepository radiologicalImagingRepository;

    @Autowired
    private AnimalRepository animalRepository;

    /**
     * Tüm radyolojik görüntüleri listeleme
     */
    @Transactional(readOnly = true)
    public List<RadiologicalImagingDto.Response> getAllRadiologicalImagings() {
        return radiologicalImagingRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sayfalanmış radyolojik görüntü listesi
     */
    @Transactional(readOnly = true)
    public Page<RadiologicalImagingDto.Response> getAllRadiologicalImagings(Pageable pageable) {
        return radiologicalImagingRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    /**
     * ID'ye göre radyolojik görüntü bulma
     */
    @Transactional(readOnly = true)
    public Optional<RadiologicalImagingDto.Response> getRadiologicalImagingById(Long id) {
        return radiologicalImagingRepository.findById(id)
                .map(this::convertToResponse);
    }

    /**
     * Hayvan ID'sine göre radyolojik görüntüleri listeleme
     */
    @Transactional(readOnly = true)
    public List<RadiologicalImagingDto.Response> getRadiologicalImagingsByAnimalId(Long animalId) {
        return radiologicalImagingRepository.findByAnimalId(animalId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Görüntü türüne göre radyolojik görüntüleri listeleme
     */
    @Transactional(readOnly = true)
    public List<RadiologicalImagingDto.Response> getRadiologicalImagingsByType(String type) {
        return radiologicalImagingRepository.findByType(type).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sahip ID'sine göre radyolojik görüntüleri listeleme
     */
    @Transactional(readOnly = true)
    public List<RadiologicalImagingDto.Response> getRadiologicalImagingsByOwnerId(Long ownerId) {
        return radiologicalImagingRepository.findByOwnerId(ownerId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Tarih aralığına göre radyolojik görüntüleri listeleme
     */
    @Transactional(readOnly = true)
    public List<RadiologicalImagingDto.Response> getRadiologicalImagingsByDateRange(LocalDate startDate, LocalDate endDate) {
        return radiologicalImagingRepository.findByDateBetween(startDate, endDate).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Görüntü türü ile radyolojik görüntü arama
     */
    @Transactional(readOnly = true)
    public List<RadiologicalImagingDto.Response> searchRadiologicalImagingsByType(String type) {
        return radiologicalImagingRepository.searchByType(type).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Yorum ile radyolojik görüntü arama
     */
    @Transactional(readOnly = true)
    public List<RadiologicalImagingDto.Response> searchRadiologicalImagingsByComment(String comment) {
        return radiologicalImagingRepository.searchByComment(comment).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Hayvan adı ile radyolojik görüntü arama
     */
    @Transactional(readOnly = true)
    public List<RadiologicalImagingDto.Response> searchRadiologicalImagingsByAnimalName(String animalName) {
        return radiologicalImagingRepository.searchByAnimalName(animalName).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sahip adı ile radyolojik görüntü arama
     */
    @Transactional(readOnly = true)
    public List<RadiologicalImagingDto.Response> searchRadiologicalImagingsByOwnerName(String ownerName) {
        return radiologicalImagingRepository.searchByOwnerName(ownerName).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Bugünkü radyolojik görüntüleri listeleme
     */
    @Transactional(readOnly = true)
    public List<RadiologicalImagingDto.Response> getTodayImagings() {
        return radiologicalImagingRepository.findTodayImagings().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Son 30 günde çekilen görüntüler
     */
    @Transactional(readOnly = true)
    public List<RadiologicalImagingDto.Response> getRecentImagings() {
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        return radiologicalImagingRepository.findRecentImagings(thirtyDaysAgo).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Tür ID'sine göre radyolojik görüntüleri listeleme
     */
    @Transactional(readOnly = true)
    public List<RadiologicalImagingDto.Response> getRadiologicalImagingsBySpeciesId(Long speciesId) {
        return radiologicalImagingRepository.findBySpeciesId(speciesId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Irk ID'sine göre radyolojik görüntüleri listeleme
     */
    @Transactional(readOnly = true)
    public List<RadiologicalImagingDto.Response> getRadiologicalImagingsByBreedId(Long breedId) {
        return radiologicalImagingRepository.findByBreedId(breedId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Belirli tarihteki görüntüleri listeleme
     */
    @Transactional(readOnly = true)
    public List<RadiologicalImagingDto.Response> getRadiologicalImagingsByDate(LocalDate date) {
        return radiologicalImagingRepository.findByDate(date).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Görüntü türü ve tarih aralığına göre görüntüleri listeleme
     */
    @Transactional(readOnly = true)
    public List<RadiologicalImagingDto.Response> getRadiologicalImagingsByTypeAndDateRange(
            String type, LocalDate startDate, LocalDate endDate) {
        return radiologicalImagingRepository.findByTypeAndDateBetween(type, startDate, endDate).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Görüntü URL'si olan kayıtları listeleme
     */
    @Transactional(readOnly = true)
    public List<RadiologicalImagingDto.Response> getRadiologicalImagingsWithImageUrl() {
        return radiologicalImagingRepository.findWithImageUrl().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Yorumu olan görüntüleri listeleme
     */
    @Transactional(readOnly = true)
    public List<RadiologicalImagingDto.Response> getRadiologicalImagingsWithComments() {
        return radiologicalImagingRepository.findWithComments().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Yorumu olmayan görüntüleri listeleme
     */
    @Transactional(readOnly = true)
    public List<RadiologicalImagingDto.Response> getRadiologicalImagingsWithoutComments() {
        return radiologicalImagingRepository.findWithoutComments().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Görüntü türü istatistikleri
     */
    @Transactional(readOnly = true)
    public List<RadiologicalImagingDto.ImagingTypeStatistics> getImagingTypeStatistics() {
        List<Object[]> results = radiologicalImagingRepository.getImagingTypeStatistics();
        long totalCount = results.stream().mapToLong(result -> (Long) result[1]).sum();
        
        return results.stream()
                .map(result -> {
                    RadiologicalImagingDto.ImagingTypeStatistics stats = new RadiologicalImagingDto.ImagingTypeStatistics();
                    stats.setType((String) result[0]);
                    stats.setCount((Long) result[1]);
                    stats.setPercentage(totalCount > 0 ? ((Long) result[1] * 100.0 / totalCount) : 0.0);
                    return stats;
                })
                .collect(Collectors.toList());
    }

    /**
     * Basit radyolojik görüntü listesi
     */
    @Transactional(readOnly = true)
    public List<RadiologicalImagingDto.Basic> getBasicRadiologicalImagingsList() {
        return radiologicalImagingRepository.findAll().stream()
                .map(this::convertToBasic)
                .collect(Collectors.toList());
    }

    /**
     * Frontend için görüntü kayıtları
     */
    @Transactional(readOnly = true)
    public List<RadiologicalImagingDto.ImagingRecord> getImagingRecordsByAnimalId(Long animalId) {
        return radiologicalImagingRepository.findByAnimalId(animalId).stream()
                .map(this::convertToImagingRecord)
                .collect(Collectors.toList());
    }

    /**
     * Yeni radyolojik görüntü oluşturma
     */
    public RadiologicalImagingDto.Response createRadiologicalImaging(RadiologicalImagingDto.Request request) {
        // Hayvan kontrolü
        Animal animal = animalRepository.findById(request.getAnimalId())
                .orElseThrow(() -> new RuntimeException("Animal not found with id: " + request.getAnimalId()));

        RadiologicalImaging radiologicalImaging = new RadiologicalImaging();
        radiologicalImaging.setAnimal(animal);
        radiologicalImaging.setDate(request.getDate());
        radiologicalImaging.setType(request.getType());
        radiologicalImaging.setComment(request.getComment());
        radiologicalImaging.setImageUrl(request.getImageUrl());

        radiologicalImaging = radiologicalImagingRepository.save(radiologicalImaging);
        return convertToResponse(radiologicalImaging);
    }

    /**
     * Radyolojik görüntü güncelleme
     */
    public RadiologicalImagingDto.Response updateRadiologicalImaging(Long id, RadiologicalImagingDto.Request request) {
        RadiologicalImaging radiologicalImaging = radiologicalImagingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Radiological imaging not found with id: " + id));

        // Hayvan kontrolü
        Animal animal = animalRepository.findById(request.getAnimalId())
                .orElseThrow(() -> new RuntimeException("Animal not found with id: " + request.getAnimalId()));

        radiologicalImaging.setAnimal(animal);
        radiologicalImaging.setDate(request.getDate());
        radiologicalImaging.setType(request.getType());
        radiologicalImaging.setComment(request.getComment());
        radiologicalImaging.setImageUrl(request.getImageUrl());

        radiologicalImaging = radiologicalImagingRepository.save(radiologicalImaging);
        return convertToResponse(radiologicalImaging);
    }

    /**
     * Radyolojik görüntü silme
     */
    public void deleteRadiologicalImaging(Long id) {
        RadiologicalImaging radiologicalImaging = radiologicalImagingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Radiological imaging not found with id: " + id));

        radiologicalImagingRepository.delete(radiologicalImaging);
    }

    // Helper methods
    private RadiologicalImagingDto.Response convertToResponse(RadiologicalImaging radiologicalImaging) {
        RadiologicalImagingDto.Response response = new RadiologicalImagingDto.Response();
        response.setId(radiologicalImaging.getId());
        response.setDate(radiologicalImaging.getDate());
        response.setType(radiologicalImaging.getType());
        response.setComment(radiologicalImaging.getComment());
        response.setImageUrl(radiologicalImaging.getImageUrl());

        if (radiologicalImaging.getAnimal() != null) {
            AnimalDto.Basic animalBasic = new AnimalDto.Basic(
                    radiologicalImaging.getAnimal().getId(),
                    radiologicalImaging.getAnimal().getName(),
                    radiologicalImaging.getAnimal().getOwner() != null ? 
                        radiologicalImaging.getAnimal().getOwner().getFirstName() + " " + radiologicalImaging.getAnimal().getOwner().getLastName() : "",
                    radiologicalImaging.getAnimal().getSpecies() != null ? radiologicalImaging.getAnimal().getSpecies().getName() : ""
            );
            animalBasic.setBreedName(radiologicalImaging.getAnimal().getBreed() != null ? radiologicalImaging.getAnimal().getBreed().getName() : "");
            animalBasic.setMicrochipNumber(radiologicalImaging.getAnimal().getMicrochipNumber());
            response.setAnimal(animalBasic);

            if (radiologicalImaging.getAnimal().getOwner() != null) {
                response.setOwner(new OwnerDto.Basic(
                        radiologicalImaging.getAnimal().getOwner().getId(),
                        radiologicalImaging.getAnimal().getOwner().getFirstName(),
                        radiologicalImaging.getAnimal().getOwner().getLastName(),
                        radiologicalImaging.getAnimal().getOwner().getPhone(),
                        radiologicalImaging.getAnimal().getOwner().getEmail()
                ));
            }
        }

        return response;
    }

    private RadiologicalImagingDto.Basic convertToBasic(RadiologicalImaging radiologicalImaging) {
        RadiologicalImagingDto.Basic basic = new RadiologicalImagingDto.Basic(
                radiologicalImaging.getId(),
                radiologicalImaging.getAnimal() != null ? radiologicalImaging.getAnimal().getName() : "",
                radiologicalImaging.getAnimal() != null && radiologicalImaging.getAnimal().getOwner() != null ? 
                    radiologicalImaging.getAnimal().getOwner().getFirstName() + " " + radiologicalImaging.getAnimal().getOwner().getLastName() : "",
                radiologicalImaging.getDate(),
                radiologicalImaging.getType()
        );
        basic.setHasImage(radiologicalImaging.getImageUrl() != null && !radiologicalImaging.getImageUrl().trim().isEmpty());
        return basic;
    }

    private RadiologicalImagingDto.ImagingRecord convertToImagingRecord(RadiologicalImaging radiologicalImaging) {
        return new RadiologicalImagingDto.ImagingRecord(
                radiologicalImaging.getId(),
                radiologicalImaging.getDate().toString(),
                radiologicalImaging.getType(),
                "", // region - veritabanında yok, boş bırakıyoruz
                radiologicalImaging.getComment(), // findings olarak comment kullanıyoruz
                radiologicalImaging.getComment(), // notes olarak da comment kullanıyoruz
                radiologicalImaging.getImageUrl()
        );
    }
} 