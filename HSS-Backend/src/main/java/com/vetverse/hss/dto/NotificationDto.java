package com.vetverse.hss.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private String id;
    private String title;
    private String message;
    private String type; // INFO, WARNING, ERROR, SUCCESS
    private String category; // APPOINTMENT, LAB_RESULT, EMERGENCY, GENERAL
    private String recipient;
    private boolean read;
    private LocalDateTime createdAt;
    private Object data; // Ek veri için
} 