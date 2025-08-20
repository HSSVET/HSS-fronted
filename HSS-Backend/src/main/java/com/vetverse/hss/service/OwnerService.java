package com.vetverse.hss.service;

import com.vetverse.hss.dto.OwnerDto;
import com.vetverse.hss.entity.Owner;
import com.vetverse.hss.repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Owner Service
 * Owner entity'si için business logic katmanı
 */
@Service
@Transactional
public class OwnerService {

    @Autowired
    private OwnerRepository ownerRepository;

    /**
     * Tüm sahipleri listeleme
     */
    @Transactional(readOnly = true)
    public List<OwnerDto.Response> getAllOwners() {
        return ownerRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sayfalanmış sahip listesi
     */
    @Transactional(readOnly = true)
    public Page<OwnerDto.Response> getAllOwners(Pageable pageable) {
        return ownerRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    /**
     * ID'ye göre sahip bulma
     */
    @Transactional(readOnly = true)
    public Optional<OwnerDto.Response> getOwnerById(Long id) {
        return ownerRepository.findById(id)
                .map(this::convertToResponse);
    }

    /**
     * Email'e göre sahip bulma
     */
    @Transactional(readOnly = true)
    public Optional<OwnerDto.Response> getOwnerByEmail(String email) {
        return ownerRepository.findByEmail(email)
                .map(this::convertToResponse);
    }

    /**
     * Telefon numarasına göre sahip bulma
     */
    @Transactional(readOnly = true)
    public Optional<OwnerDto.Response> getOwnerByPhone(String phone) {
        return ownerRepository.findByPhone(phone)
                .map(this::convertToResponse);
    }

    /**
     * Ad soyad ile sahip arama
     */
    @Transactional(readOnly = true)
    public List<OwnerDto.Response> searchOwnersByName(String name) {
        return ownerRepository.searchByFullName(name).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Email ile sahip arama
     */
    @Transactional(readOnly = true)
    public List<OwnerDto.Response> searchOwnersByEmail(String email) {
        return ownerRepository.searchByEmail(email).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Telefon ile sahip arama
     */
    @Transactional(readOnly = true)
    public List<OwnerDto.Response> searchOwnersByPhone(String phone) {
        return ownerRepository.searchByPhone(phone).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Hayvanı olan sahipleri listeleme
     */
    @Transactional(readOnly = true)
    public List<OwnerDto.Response> getOwnersWithAnimals() {
        return ownerRepository.findOwnersWithAnimals().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Dropdown için basit sahip listesi
     */
    @Transactional(readOnly = true)
    public List<OwnerDto.Basic> getBasicOwnersList() {
        return ownerRepository.findAll().stream()
                .map(this::convertToBasic)
                .collect(Collectors.toList());
    }

    /**
     * Yeni sahip oluşturma
     */
    public OwnerDto.Response createOwner(OwnerDto.Request request) {
        // Email kontrolü
        if (request.getEmail() != null && ownerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Owner with email '" + request.getEmail() + "' already exists");
        }

        // Telefon kontrolü
        if (request.getPhone() != null && ownerRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Owner with phone '" + request.getPhone() + "' already exists");
        }

        Owner owner = new Owner(
                request.getFirstName(),
                request.getLastName(),
                request.getPhone(),
                request.getEmail(),
                request.getAddress()
        );

        owner = ownerRepository.save(owner);
        return convertToResponse(owner);
    }

    /**
     * Sahip güncelleme
     */
    public OwnerDto.Response updateOwner(Long id, OwnerDto.Request request) {
        Owner owner = ownerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Owner not found with id: " + id));

        // Farklı sahipte aynı email kontrolü
        if (request.getEmail() != null && 
            !request.getEmail().equals(owner.getEmail()) && 
            ownerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Owner with email '" + request.getEmail() + "' already exists");
        }

        // Farklı sahipte aynı telefon kontrolü
        if (request.getPhone() != null && 
            !request.getPhone().equals(owner.getPhone()) && 
            ownerRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Owner with phone '" + request.getPhone() + "' already exists");
        }

        owner.setFirstName(request.getFirstName());
        owner.setLastName(request.getLastName());
        owner.setPhone(request.getPhone());
        owner.setEmail(request.getEmail());
        owner.setAddress(request.getAddress());

        owner = ownerRepository.save(owner);
        return convertToResponse(owner);
    }

    /**
     * Sahip silme
     */
    public void deleteOwner(Long id) {
        Owner owner = ownerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Owner not found with id: " + id));

        // Hayvanları olan sahipi silme kontrolü
        if (!owner.getAnimals().isEmpty()) {
            throw new RuntimeException("Cannot delete owner that has animals. Please reassign animals first.");
        }

        ownerRepository.delete(owner);
    }

    /**
     * Email'in mevcut olup olmadığını kontrol etme
     */
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return ownerRepository.existsByEmail(email);
    }

    /**
     * Telefon numarasının mevcut olup olmadığını kontrol etme
     */
    @Transactional(readOnly = true)
    public boolean existsByPhone(String phone) {
        return ownerRepository.existsByPhone(phone);
    }

    // Helper methods
    private OwnerDto.Response convertToResponse(Owner owner) {
        OwnerDto.Response response = new OwnerDto.Response();
        response.setId(owner.getId());
        response.setFirstName(owner.getFirstName());
        response.setLastName(owner.getLastName());
        response.setPhone(owner.getPhone());
        response.setEmail(owner.getEmail());
        response.setAddress(owner.getAddress());
        response.setAnimalCount(owner.getAnimals().size());
        return response;
    }

    private OwnerDto.Basic convertToBasic(Owner owner) {
        return new OwnerDto.Basic(
                owner.getId(),
                owner.getFirstName(),
                owner.getLastName(),
                owner.getPhone(),
                owner.getEmail()
        );
    }
} 