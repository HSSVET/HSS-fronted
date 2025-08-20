package com.vetverse.hss.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * Reminder Entity
 * Represents reminders (hatirlatma tablosu)
 */
@Entity
@Table(name = "hatirlatma")
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hatirlatma_id")
    private Long id;

    @NotNull
    @Column(name = "gonderim_zamani", nullable = false)
    private LocalDateTime sendTime;

    @Column(name = "kanal", length = 10)
    private String channel;

    @Column(name = "durum", length = 20)
    private String status;

    // Many-to-One relationship with Appointment
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "randevu_id", referencedColumnName = "randevu_id", nullable = false)
    @JsonBackReference
    private Appointment appointment;

    // Constructors
    public Reminder() {}

    public Reminder(LocalDateTime sendTime, String channel, String status, Appointment appointment) {
        this.sendTime = sendTime;
        this.channel = channel;
        this.status = status;
        this.appointment = appointment;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getSendTime() {
        return sendTime;
    }

    public void setSendTime(LocalDateTime sendTime) {
        this.sendTime = sendTime;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

    @Override
    public String toString() {
        return "Reminder{" +
                "id=" + id +
                ", sendTime=" + sendTime +
                ", channel='" + channel + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
} 