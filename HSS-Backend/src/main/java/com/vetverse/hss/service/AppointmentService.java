package com.vetverse.hss.service;

import com.vetverse.hss.dto.AppointmentDto;
import com.vetverse.hss.dto.AnimalDto;
import com.vetverse.hss.dto.OwnerDto;
import com.vetverse.hss.entity.Appointment;
import com.vetverse.hss.entity.Animal;
import com.vetverse.hss.repository.AppointmentRepository;
import com.vetverse.hss.repository.AnimalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Appointment Service
 * Appointment entity'si için business logic katmanı
 */
@Service
@Transactional
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private ReminderService reminderService;

    /**
     * Tüm randevuları listeleme
     */
    @Transactional(readOnly = true)
    public List<AppointmentDto.Response> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sayfalanmış randevu listesi
     */
    @Transactional(readOnly = true)
    public Page<AppointmentDto.Response> getAllAppointments(Pageable pageable) {
        return appointmentRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    /**
     * ID'ye göre randevu bulma
     */
    @Transactional(readOnly = true)
    public Optional<AppointmentDto.Response> getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .map(this::convertToResponse);
    }

    /**
     * Hayvan ID'sine göre randevuları listeleme
     */
    @Transactional(readOnly = true)
    public List<AppointmentDto.Response> getAppointmentsByAnimalId(Long animalId) {
        return appointmentRepository.findByAnimalId(animalId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Veteriner ID'sine göre randevuları listeleme
     */
    @Transactional(readOnly = true)
    public List<AppointmentDto.Response> getAppointmentsByVeterinarianId(Long veterinarianId) {
        return appointmentRepository.findByVeterinarianId(veterinarianId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Tarih aralığına göre randevuları listeleme
     */
    @Transactional(readOnly = true)
    public List<AppointmentDto.Response> getAppointmentsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return appointmentRepository.findByDateTimeBetween(startDate, endDate).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Belirli tarihteki randevuları listeleme
     */
    @Transactional(readOnly = true)
    public List<AppointmentDto.Response> getAppointmentsByDate(LocalDate date) {
        return appointmentRepository.findByDate(date).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Bugünkü randevuları listeleme
     */
    @Transactional(readOnly = true)
    public List<AppointmentDto.Response> getTodayAppointments() {
        return appointmentRepository.findTodayAppointments().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Gelecek randevuları listeleme
     */
    @Transactional(readOnly = true)
    public List<AppointmentDto.Response> getUpcomingAppointments() {
        LocalDateTime nextWeek = LocalDateTime.now().plusWeeks(1);
        return appointmentRepository.findUpcomingAppointments(nextWeek).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sahip ID'sine göre randevuları listeleme
     */
    @Transactional(readOnly = true)
    public List<AppointmentDto.Response> getAppointmentsByOwnerId(Long ownerId) {
        return appointmentRepository.findByOwnerId(ownerId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Konu ile randevu arama
     */
    @Transactional(readOnly = true)
    public List<AppointmentDto.Response> searchAppointmentsBySubject(String subject) {
        return appointmentRepository.searchBySubject(subject).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Hayvan adı ile randevu arama
     */
    @Transactional(readOnly = true)
    public List<AppointmentDto.Response> searchAppointmentsByAnimalName(String animalName) {
        return appointmentRepository.searchByAnimalName(animalName).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Sahip adı ile randevu arama
     */
    @Transactional(readOnly = true)
    public List<AppointmentDto.Response> searchAppointmentsByOwnerName(String ownerName) {
        return appointmentRepository.searchByOwnerName(ownerName).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Kalendar görünümü için randevu listesi
     */
    @Transactional(readOnly = true)
    public List<AppointmentDto.CalendarView> getCalendarAppointments(LocalDateTime startDate, LocalDateTime endDate) {
        return appointmentRepository.findByDateTimeBetween(startDate, endDate).stream()
                .map(this::convertToCalendarView)
                .collect(Collectors.toList());
    }

    /**
     * Basit randevu listesi
     */
    @Transactional(readOnly = true)
    public List<AppointmentDto.Basic> getBasicAppointmentsList() {
        return appointmentRepository.findAll().stream()
                .map(this::convertToBasic)
                .collect(Collectors.toList());
    }

    /**
     * Yeni randevu oluşturma
     */
    public AppointmentDto.Response createAppointment(AppointmentDto.Request request) {
        // Hayvan kontrolü
        Animal animal = animalRepository.findById(request.getAnimalId())
                .orElseThrow(() -> new RuntimeException("Animal not found with id: " + request.getAnimalId()));

        // Randevu çakışması kontrolü (isteğe bağlı)
        if (request.getVeterinarianId() != null) {
            LocalDateTime startTime = request.getDateTime();
            LocalDateTime endTime = startTime.plusHours(1); // 1 saatlik randevu varsayımı
            Long conflicts = appointmentRepository.countConflictingAppointments(
                    request.getVeterinarianId(), startTime, endTime);
            if (conflicts > 0) {
                throw new RuntimeException("Veterinarian has conflicting appointment at this time");
            }
        }

        Appointment appointment = new Appointment();
        appointment.setAnimal(animal);
        appointment.setDateTime(request.getDateTime());
        appointment.setSubject(request.getSubject());
        appointment.setVeterinarianId(request.getVeterinarianId());

        appointment = appointmentRepository.save(appointment);
        
        // Otomatik hatırlatma oluştur
        try {
            createAutomaticReminders(appointment);
        } catch (Exception e) {
            // Hatırlatma oluşturma hatası randevu oluşturmayı engellemez
            // Log at ve devam et
            System.err.println("Failed to create automatic reminders for appointment " + appointment.getId() + ": " + e.getMessage());
        }
        
        return convertToResponse(appointment);
    }

    /**
     * Randevu güncelleme
     */
    public AppointmentDto.Response updateAppointment(Long id, AppointmentDto.Request request) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));

        // Hayvan kontrolü
        Animal animal = animalRepository.findById(request.getAnimalId())
                .orElseThrow(() -> new RuntimeException("Animal not found with id: " + request.getAnimalId()));

        appointment.setAnimal(animal);
        appointment.setDateTime(request.getDateTime());
        appointment.setSubject(request.getSubject());
        appointment.setVeterinarianId(request.getVeterinarianId());

        appointment = appointmentRepository.save(appointment);
        return convertToResponse(appointment);
    }

    /**
     * Randevu silme
     */
    public void deleteAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));

        appointmentRepository.delete(appointment);
    }

    // Helper methods
    private AppointmentDto.Response convertToResponse(Appointment appointment) {
        AppointmentDto.Response response = new AppointmentDto.Response();
        response.setId(appointment.getId());
        response.setDateTime(appointment.getDateTime());
        response.setSubject(appointment.getSubject());
        response.setVeterinarianId(appointment.getVeterinarianId());

        if (appointment.getAnimal() != null) {
            AnimalDto.Basic animalBasic = new AnimalDto.Basic(
                    appointment.getAnimal().getId(),
                    appointment.getAnimal().getName(),
                    appointment.getAnimal().getOwner() != null ? 
                        appointment.getAnimal().getOwner().getFirstName() + " " + appointment.getAnimal().getOwner().getLastName() : "",
                    appointment.getAnimal().getSpecies() != null ? appointment.getAnimal().getSpecies().getName() : ""
            );
            animalBasic.setBreedName(appointment.getAnimal().getBreed() != null ? appointment.getAnimal().getBreed().getName() : "");
            animalBasic.setMicrochipNumber(appointment.getAnimal().getMicrochipNumber());
            response.setAnimal(animalBasic);
            
            if (appointment.getAnimal().getOwner() != null) {
                response.setOwner(new OwnerDto.Basic(
                        appointment.getAnimal().getOwner().getId(),
                        appointment.getAnimal().getOwner().getFirstName(),
                        appointment.getAnimal().getOwner().getLastName(),
                        appointment.getAnimal().getOwner().getPhone(),
                        appointment.getAnimal().getOwner().getEmail()
                ));
            }
        }

        return response;
    }

    private AppointmentDto.Basic convertToBasic(Appointment appointment) {
        return new AppointmentDto.Basic(
                appointment.getId(),
                appointment.getAnimal() != null ? appointment.getAnimal().getName() : "",
                appointment.getAnimal() != null && appointment.getAnimal().getOwner() != null ? 
                    appointment.getAnimal().getOwner().getFirstName() + " " + appointment.getAnimal().getOwner().getLastName() : "",
                appointment.getDateTime(),
                appointment.getSubject()
        );
    }

    private AppointmentDto.CalendarView convertToCalendarView(Appointment appointment) {
        AppointmentDto.CalendarView calendarView = new AppointmentDto.CalendarView();
        calendarView.setId(appointment.getId());
        calendarView.setStart(appointment.getDateTime());
        calendarView.setEnd(appointment.getDateTime().plusHours(1)); // 1 saatlik randevu varsayımı
        
        String title = "";
        if (appointment.getAnimal() != null) {
            title = appointment.getAnimal().getName();
            if (appointment.getAnimal().getOwner() != null) {
                title += " - " + appointment.getAnimal().getOwner().getFirstName() + " " + appointment.getAnimal().getOwner().getLastName();
            }
        }
        calendarView.setTitle(title);
        
        calendarView.setBackgroundColor("#007bff");
        calendarView.setTextColor("#ffffff");

        AppointmentDto.AppointmentMeta meta = new AppointmentDto.AppointmentMeta();
        meta.setAnimalName(appointment.getAnimal() != null ? appointment.getAnimal().getName() : "");
        meta.setOwnerName(appointment.getAnimal() != null && appointment.getAnimal().getOwner() != null ? 
            appointment.getAnimal().getOwner().getFirstName() + " " + appointment.getAnimal().getOwner().getLastName() : "");
        meta.setSubject(appointment.getSubject());
        
        calendarView.setExtendedProps(meta);
        
        return calendarView;
    }

    /**
     * Otomatik hatırlatma oluştur
     */
    private void createAutomaticReminders(Appointment appointment) {
        // Randevu tarihinden 1 gün önce (sabah 9:00) hatırlatma oluştur
        LocalDateTime reminderTime = appointment.getDateTime().minusDays(1).withHour(9).withMinute(0);
        
        // Eğer hatırlatma zamanı şu andan sonraysa oluştur
        if (reminderTime.isAfter(LocalDateTime.now())) {
            // SMS hatırlatması
            reminderService.createManualReminder(appointment.getId(), "SMS", reminderTime);
            
            // Email hatırlatması
            reminderService.createManualReminder(appointment.getId(), "EMAIL", reminderTime);
        }
    }
} 