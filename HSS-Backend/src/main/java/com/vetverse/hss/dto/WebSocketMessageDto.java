package com.vetverse.hss.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebSocketMessageDto {
    private String type;
    private String from;
    private String to;
    private String message;
    private Object data;
    private LocalDateTime timestamp;
    private String sessionId;
} 