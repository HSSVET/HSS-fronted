package com.vetverse.hss.controller;

import com.vetverse.hss.dto.OwnerDto;
import com.vetverse.hss.service.OwnerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Owner Controller
 * Owner API endpoints
 */
@RestController
@RequestMapping("/api/owners")
@PreAuthorize("hasAnyRole('VETERINER', 'ADMIN', 'SEKRETER')")
public class OwnerController {

    @Autowired
    private OwnerService ownerService;

    /**
     * Tüm sahipleri listeleme
     */
    @GetMapping
    public ResponseEntity<List<OwnerDto.Response>> getAllOwners() {
        List<OwnerDto.Response> owners = ownerService.getAllOwners();
        return ResponseEntity.ok(owners);
    }

    /**
     * Sayfalanmış sahip listesi
     */
    @GetMapping("/paged")
    public ResponseEntity<Page<OwnerDto.Response>> getAllOwnersPaged(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<OwnerDto.Response> owners = ownerService.getAllOwners(pageable);
        return ResponseEntity.ok(owners);
    }

    /**
     * ID'ye göre sahip bulma
     */
    @GetMapping("/{id}")
    public ResponseEntity<OwnerDto.Response> getOwnerById(@PathVariable Long id) {
        return ownerService.getOwnerById(id)
                .map(owner -> ResponseEntity.ok(owner))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Email'e göre sahip bulma
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<OwnerDto.Response> getOwnerByEmail(@PathVariable String email) {
        return ownerService.getOwnerByEmail(email)
                .map(owner -> ResponseEntity.ok(owner))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Telefon numarasına göre sahip bulma
     */
    @GetMapping("/phone/{phone}")
    public ResponseEntity<OwnerDto.Response> getOwnerByPhone(@PathVariable String phone) {
        return ownerService.getOwnerByPhone(phone)
                .map(owner -> ResponseEntity.ok(owner))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Ad soyad ile sahip arama
     */
    @GetMapping("/search/name")
    public ResponseEntity<List<OwnerDto.Response>> searchOwnersByName(@RequestParam String name) {
        List<OwnerDto.Response> owners = ownerService.searchOwnersByName(name);
        return ResponseEntity.ok(owners);
    }

    /**
     * Email ile sahip arama
     */
    @GetMapping("/search/email")
    public ResponseEntity<List<OwnerDto.Response>> searchOwnersByEmail(@RequestParam String email) {
        List<OwnerDto.Response> owners = ownerService.searchOwnersByEmail(email);
        return ResponseEntity.ok(owners);
    }

    /**
     * Telefon ile sahip arama
     */
    @GetMapping("/search/phone")
    public ResponseEntity<List<OwnerDto.Response>> searchOwnersByPhone(@RequestParam String phone) {
        List<OwnerDto.Response> owners = ownerService.searchOwnersByPhone(phone);
        return ResponseEntity.ok(owners);
    }

    /**
     * Hayvanı olan sahipleri listeleme
     */
    @GetMapping("/with-animals")
    public ResponseEntity<List<OwnerDto.Response>> getOwnersWithAnimals() {
        List<OwnerDto.Response> owners = ownerService.getOwnersWithAnimals();
        return ResponseEntity.ok(owners);
    }

    /**
     * Dropdown için basit sahip listesi
     */
    @GetMapping("/basic")
    public ResponseEntity<List<OwnerDto.Basic>> getBasicOwnersList() {
        List<OwnerDto.Basic> owners = ownerService.getBasicOwnersList();
        return ResponseEntity.ok(owners);
    }

    /**
     * Yeni sahip oluşturma
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('VETERINER', 'ADMIN', 'SEKRETER')")
    public ResponseEntity<OwnerDto.Response> createOwner(@Valid @RequestBody OwnerDto.Request request) {
        try {
            OwnerDto.Response owner = ownerService.createOwner(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(owner);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Sahip güncelleme
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('VETERINER', 'ADMIN', 'SEKRETER')")
    public ResponseEntity<OwnerDto.Response> updateOwner(
            @PathVariable Long id, 
            @Valid @RequestBody OwnerDto.Request request) {
        try {
            OwnerDto.Response owner = ownerService.updateOwner(id, request);
            return ResponseEntity.ok(owner);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Sahip silme
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VETERINER')")
    public ResponseEntity<Map<String, String>> deleteOwner(@PathVariable Long id) {
        try {
            ownerService.deleteOwner(id);
            return ResponseEntity.ok(Map.of(
                "message", "Owner deleted successfully",
                "status", "success"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", e.getMessage(),
                "status", "error"
            ));
        }
    }

    /**
     * Email'in mevcut olup olmadığını kontrol etme
     */
    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmailExists(@RequestParam String email) {
        boolean exists = ownerService.existsByEmail(email);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    /**
     * Telefon numarasının mevcut olup olmadığını kontrol etme
     */
    @GetMapping("/check-phone")
    public ResponseEntity<Map<String, Boolean>> checkPhoneExists(@RequestParam String phone) {
        boolean exists = ownerService.existsByPhone(phone);
        return ResponseEntity.ok(Map.of("exists", exists));
    }
} 