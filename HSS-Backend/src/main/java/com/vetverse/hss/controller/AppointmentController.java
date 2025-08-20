package com.vetverse.hss.controller;

import com.vetverse.hss.dto.AppointmentDto;
import com.vetverse.hss.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Appointment Controller
 * Appointment API endpoints
 */
@RestController
@RequestMapping("/api/appointments")
@PreAuthorize("hasAnyRole('VETERINER', 'ADMIN', 'SEKRETER')")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    /**
     * Tüm randevuları listeleme
     */
    @GetMapping
    public ResponseEntity<List<AppointmentDto.Response>> getAllAppointments() {
        List<AppointmentDto.Response> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }

    /**
     * Sayfalanmış randevu listesi
     */
    @GetMapping("/paged")
    public ResponseEntity<Page<AppointmentDto.Response>> getAllAppointmentsPaged(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<AppointmentDto.Response> appointments = appointmentService.getAllAppointments(pageable);
        return ResponseEntity.ok(appointments);
    }

    /**
     * ID'ye göre randevu bulma
     */
    @GetMapping("/{id}")
    public ResponseEntity<AppointmentDto.Response> getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id)
                .map(appointment -> ResponseEntity.ok(appointment))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Hayvan ID'sine göre randevuları listeleme
     */
    @GetMapping("/animal/{animalId}")
    public ResponseEntity<List<AppointmentDto.Response>> getAppointmentsByAnimalId(@PathVariable Long animalId) {
        List<AppointmentDto.Response> appointments = appointmentService.getAppointmentsByAnimalId(animalId);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Veteriner ID'sine göre randevuları listeleme
     */
    @GetMapping("/veterinarian/{veterinarianId}")
    public ResponseEntity<List<AppointmentDto.Response>> getAppointmentsByVeterinarianId(@PathVariable Long veterinarianId) {
        List<AppointmentDto.Response> appointments = appointmentService.getAppointmentsByVeterinarianId(veterinarianId);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Sahip ID'sine göre randevuları listeleme
     */
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<AppointmentDto.Response>> getAppointmentsByOwnerId(@PathVariable Long ownerId) {
        List<AppointmentDto.Response> appointments = appointmentService.getAppointmentsByOwnerId(ownerId);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Belirli tarihteki randevuları listeleme
     */
    @GetMapping("/date/{date}")
    public ResponseEntity<List<AppointmentDto.Response>> getAppointmentsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<AppointmentDto.Response> appointments = appointmentService.getAppointmentsByDate(date);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Tarih aralığına göre randevuları listeleme
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<AppointmentDto.Response>> getAppointmentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<AppointmentDto.Response> appointments = appointmentService.getAppointmentsByDateRange(startDate, endDate);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Bugünkü randevuları listeleme
     */
    @GetMapping("/today")
    public ResponseEntity<List<AppointmentDto.Response>> getTodayAppointments() {
        List<AppointmentDto.Response> appointments = appointmentService.getTodayAppointments();
        return ResponseEntity.ok(appointments);
    }

    /**
     * Gelecek randevuları listeleme
     */
    @GetMapping("/upcoming")
    public ResponseEntity<List<AppointmentDto.Response>> getUpcomingAppointments() {
        List<AppointmentDto.Response> appointments = appointmentService.getUpcomingAppointments();
        return ResponseEntity.ok(appointments);
    }

    /**
     * Konu ile randevu arama
     */
    @GetMapping("/search/subject")
    public ResponseEntity<List<AppointmentDto.Response>> searchAppointmentsBySubject(@RequestParam String subject) {
        List<AppointmentDto.Response> appointments = appointmentService.searchAppointmentsBySubject(subject);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Hayvan adı ile randevu arama
     */
    @GetMapping("/search/animal")
    public ResponseEntity<List<AppointmentDto.Response>> searchAppointmentsByAnimalName(@RequestParam String animalName) {
        List<AppointmentDto.Response> appointments = appointmentService.searchAppointmentsByAnimalName(animalName);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Sahip adı ile randevu arama
     */
    @GetMapping("/search/owner")
    public ResponseEntity<List<AppointmentDto.Response>> searchAppointmentsByOwnerName(@RequestParam String ownerName) {
        List<AppointmentDto.Response> appointments = appointmentService.searchAppointmentsByOwnerName(ownerName);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Takvim görünümü için randevu listesi
     */
    @GetMapping("/calendar")
    public ResponseEntity<List<AppointmentDto.CalendarView>> getCalendarAppointments(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        System.out.println("🔍 Calendar endpoint called with:");
        System.out.println("   Start Date: " + startDate);
        System.out.println("   End Date: " + endDate);
        
        List<AppointmentDto.CalendarView> appointments = appointmentService.getCalendarAppointments(startDate, endDate);
        
        System.out.println("✅ Found " + appointments.size() + " appointments");
        
        return ResponseEntity.ok(appointments);
    }

    /**
     * Dropdown için basit randevu listesi
     */
    @GetMapping("/basic")
    public ResponseEntity<List<AppointmentDto.Basic>> getBasicAppointmentsList() {
        List<AppointmentDto.Basic> appointments = appointmentService.getBasicAppointmentsList();
        return ResponseEntity.ok(appointments);
    }

    /**
     * Yeni randevu oluşturma
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('VETERINER', 'ADMIN', 'SEKRETER')")
    public ResponseEntity<AppointmentDto.Response> createAppointment(@Valid @RequestBody AppointmentDto.Request request) {
        try {
            AppointmentDto.Response appointment = appointmentService.createAppointment(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Randevu güncelleme
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('VETERINER', 'ADMIN', 'SEKRETER')")
    public ResponseEntity<AppointmentDto.Response> updateAppointment(
            @PathVariable Long id, 
            @Valid @RequestBody AppointmentDto.Request request) {
        try {
            AppointmentDto.Response appointment = appointmentService.updateAppointment(id, request);
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Randevu silme
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VETERINER')")
    public ResponseEntity<Map<String, String>> deleteAppointment(@PathVariable Long id) {
        try {
            appointmentService.deleteAppointment(id);
            return ResponseEntity.ok(Map.of(
                "message", "Appointment deleted successfully",
                "status", "success"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", e.getMessage(),
                "status", "error"
            ));
        }
    }
} 