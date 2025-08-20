package com.vetverse.hss.service;

import com.vetverse.hss.dto.AnimalDto;
import com.vetverse.hss.dto.BreedDto;
import com.vetverse.hss.dto.OwnerDto;
import com.vetverse.hss.dto.SpeciesDto;
import com.vetverse.hss.entity.Animal;
import com.vetverse.hss.entity.Breed;
import com.vetverse.hss.entity.Owner;
import com.vetverse.hss.entity.Species;
import com.vetverse.hss.repository.AnimalRepository;
import com.vetverse.hss.repository.BreedRepository;
import com.vetverse.hss.repository.OwnerRepository;
import com.vetverse.hss.repository.SpeciesRepository;
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
 * Animal Service
 * Animal entity'si için business logic katmanı
 */
@Service
@Transactional
public class AnimalService {

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private SpeciesRepository speciesRepository;

    @Autowired
    private BreedRepository breedRepository;

    /**
     * Tüm hayvanları listeleme
     */
    @Transactional(readOnly = true)
    public List<AnimalDto.Response> getAllAnimals() {
        return animalRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sayfalanmış hayvan listesi
     */
    @Transactional(readOnly = true)
    public Page<AnimalDto.Response> getAllAnimals(Pageable pageable) {
        return animalRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    /**
     * ID'ye göre hayvan bulma
     */
    @Transactional(readOnly = true)
    public Optional<AnimalDto.Response> getAnimalById(Long id) {
        return animalRepository.findById(id)
                .map(this::convertToResponse);
    }

    /**
     * Mikroçip numarasına göre hayvan bulma
     */
    @Transactional(readOnly = true)
    public Optional<AnimalDto.Response> getAnimalByMicrochip(String microchipNumber) {
        return animalRepository.findByMicrochipNumber(microchipNumber)
                .map(this::convertToResponse);
    }

    /**
     * Sahibe göre hayvan listeleme
     */
    @Transactional(readOnly = true)
    public List<AnimalDto.Response> getAnimalsByOwnerId(Long ownerId) {
        return animalRepository.findByOwnerId(ownerId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Türe göre hayvan listeleme
     */
    @Transactional(readOnly = true)
    public List<AnimalDto.Response> getAnimalsBySpeciesId(Long speciesId) {
        return animalRepository.findBySpeciesId(speciesId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Irka göre hayvan listeleme
     */
    @Transactional(readOnly = true)
    public List<AnimalDto.Response> getAnimalsByBreedId(Long breedId) {
        return animalRepository.findByBreedId(breedId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * İsme göre hayvan arama
     */
    @Transactional(readOnly = true)
    public List<AnimalDto.Response> searchAnimalsByName(String name) {
        return animalRepository.searchByName(name).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sahip adına göre hayvan arama
     */
    @Transactional(readOnly = true)
    public List<AnimalDto.Response> searchAnimalsByOwnerName(String ownerName) {
        return animalRepository.searchByOwnerName(ownerName).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Mikroçip numarasına göre hayvan arama
     */
    @Transactional(readOnly = true)
    public List<AnimalDto.Response> searchAnimalsByMicrochip(String microchip) {
        return animalRepository.searchByMicrochip(microchip).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Alerji bilgisi olan hayvanları listeleme
     */
    @Transactional(readOnly = true)
    public List<AnimalDto.Response> getAnimalsWithAllergies() {
        return animalRepository.findAnimalsWithAllergies().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Kronik hastalığı olan hayvanları listeleme
     */
    @Transactional(readOnly = true)
    public List<AnimalDto.Response> getAnimalsWithChronicDiseases() {
        return animalRepository.findAnimalsWithChronicDiseases().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Bugün doğum günü olan hayvanları listeleme
     */
    @Transactional(readOnly = true)
    public List<AnimalDto.Response> getAnimalsWithBirthdayToday() {
        return animalRepository.findAnimalsWithBirthdayToday().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Bu ay doğum günü olan hayvanları listeleme
     */
    @Transactional(readOnly = true)
    public List<AnimalDto.Response> getAnimalsWithBirthdayThisMonth() {
        return animalRepository.findAnimalsWithBirthdayThisMonth().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Dropdown için basit hayvan listesi
     */
    @Transactional(readOnly = true)
    public List<AnimalDto.Basic> getBasicAnimalsList() {
        return animalRepository.findAll().stream()
                .map(this::convertToBasic)
                .collect(Collectors.toList());
    }

    /**
     * Yeni hayvan oluşturma
     */
    public AnimalDto.Response createAnimal(AnimalDto.Request request) {
        // Mikroçip kontrolü
        if (request.getMicrochipNumber() != null && 
            animalRepository.existsByMicrochipNumber(request.getMicrochipNumber())) {
            throw new RuntimeException("Animal with microchip '" + request.getMicrochipNumber() + "' already exists");
        }

        // Sahip kontrolü
        Owner owner = ownerRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found with id: " + request.getOwnerId()));

        // Tür kontrolü
        Species species = speciesRepository.findById(request.getSpeciesId())
                .orElseThrow(() -> new RuntimeException("Species not found with id: " + request.getSpeciesId()));

        // Irk kontrolü (opsiyonel)
        Breed breed = null;
        if (request.getBreedId() != null) {
            breed = breedRepository.findById(request.getBreedId())
                    .orElseThrow(() -> new RuntimeException("Breed not found with id: " + request.getBreedId()));
            
            // Irkın türe ait olup olmadığı kontrolü
            if (!breed.getSpecies().getId().equals(species.getId())) {
                throw new RuntimeException("Breed does not belong to the specified species");
            }
        }

        Animal animal = new Animal(request.getName(), owner, species, breed);
        animal.setGender(request.getGender());
        animal.setBirthDate(request.getBirthDate());
        animal.setWeight(request.getWeight());
        animal.setColor(request.getColor());
        animal.setMicrochipNumber(request.getMicrochipNumber());
        animal.setAllergies(request.getAllergies());
        animal.setChronicDiseases(request.getChronicDiseases());
        animal.setNotes(request.getNotes());

        animal = animalRepository.save(animal);
        return convertToResponse(animal);
    }

    /**
     * Hayvan güncelleme
     */
    public AnimalDto.Response updateAnimal(Long id, AnimalDto.Request request) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Animal not found with id: " + id));

        // Farklı hayvanda aynı mikroçip kontrolü
        if (request.getMicrochipNumber() != null && 
            !request.getMicrochipNumber().equals(animal.getMicrochipNumber()) && 
            animalRepository.existsByMicrochipNumber(request.getMicrochipNumber())) {
            throw new RuntimeException("Animal with microchip '" + request.getMicrochipNumber() + "' already exists");
        }

        // Sahip kontrolü
        Owner owner = ownerRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found with id: " + request.getOwnerId()));

        // Tür kontrolü
        Species species = speciesRepository.findById(request.getSpeciesId())
                .orElseThrow(() -> new RuntimeException("Species not found with id: " + request.getSpeciesId()));

        // Irk kontrolü (opsiyonel)
        Breed breed = null;
        if (request.getBreedId() != null) {
            breed = breedRepository.findById(request.getBreedId())
                    .orElseThrow(() -> new RuntimeException("Breed not found with id: " + request.getBreedId()));
            
            // Irkın türe ait olup olmadığı kontrolü
            if (!breed.getSpecies().getId().equals(species.getId())) {
                throw new RuntimeException("Breed does not belong to the specified species");
            }
        }

        animal.setName(request.getName());
        animal.setOwner(owner);
        animal.setSpecies(species);
        animal.setBreed(breed);
        animal.setGender(request.getGender());
        animal.setBirthDate(request.getBirthDate());
        animal.setWeight(request.getWeight());
        animal.setColor(request.getColor());
        animal.setMicrochipNumber(request.getMicrochipNumber());
        animal.setAllergies(request.getAllergies());
        animal.setChronicDiseases(request.getChronicDiseases());
        animal.setNotes(request.getNotes());

        animal = animalRepository.save(animal);
        return convertToResponse(animal);
    }

    /**
     * Hayvan silme
     */
    public void deleteAnimal(Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Animal not found with id: " + id));

        animalRepository.delete(animal);
    }

    /**
     * Mikroçip numarasının mevcut olup olmadığını kontrol etme
     */
    @Transactional(readOnly = true)
    public boolean existsByMicrochipNumber(String microchipNumber) {
        return animalRepository.existsByMicrochipNumber(microchipNumber);
    }

    // Helper methods
    private AnimalDto.Response convertToResponse(Animal animal) {
        AnimalDto.Response response = new AnimalDto.Response();
        response.setId(animal.getId());
        response.setName(animal.getName());
        
        // Owner bilgisi
        if (animal.getOwner() != null) {
            response.setOwner(new OwnerDto.Basic(
                    animal.getOwner().getId(),
                    animal.getOwner().getFirstName(),
                    animal.getOwner().getLastName(),
                    animal.getOwner().getPhone(),
                    animal.getOwner().getEmail()
            ));
        }
        
        // Species bilgisi
        if (animal.getSpecies() != null) {
            response.setSpecies(new SpeciesDto.Basic(
                    animal.getSpecies().getId(),
                    animal.getSpecies().getName()
            ));
        }
        
        // Breed bilgisi
        if (animal.getBreed() != null) {
            response.setBreed(new BreedDto.Basic(
                    animal.getBreed().getId(),
                    animal.getBreed().getName(),
                    animal.getBreed().getSpecies().getId()
            ));
        }
        
        response.setGender(animal.getGender());
        response.setBirthDate(animal.getBirthDate());
        response.setAgeInYears(animal.getAgeInYears());
        response.setWeight(animal.getWeight());
        response.setColor(animal.getColor());
        response.setMicrochipNumber(animal.getMicrochipNumber());
        response.setAllergies(animal.getAllergies());
        response.setChronicDiseases(animal.getChronicDiseases());
        response.setNotes(animal.getNotes());
        
        return response;
    }

    private AnimalDto.Basic convertToBasic(Animal animal) {
        AnimalDto.Basic basic = new AnimalDto.Basic();
        basic.setId(animal.getId());
        basic.setName(animal.getName());
        basic.setMicrochipNumber(animal.getMicrochipNumber());
        
        if (animal.getOwner() != null) {
            basic.setOwnerName(animal.getOwner().getFullName());
        }
        
        if (animal.getSpecies() != null) {
            basic.setSpeciesName(animal.getSpecies().getName());
        }
        
        if (animal.getBreed() != null) {
            basic.setBreedName(animal.getBreed().getName());
        }
        
        return basic;
    }
} 