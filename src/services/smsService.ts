import { apiClient } from './api';
import { API_ENDPOINTS } from '../constants';

// Backend DTO eşleştirmeleri
export type SmsProvider = 'TWILIO' | 'NETGSM' | 'AUTO';
export type SmsType = 'NOTIFICATION' | 'REMINDER' | 'ALERT' | 'VERIFICATION' | 'MARKETING' | 'SYSTEM';
export type SmsPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | 'CRITICAL';
export type SmsCategory = 'APPOINTMENT' | 'MEDICAL' | 'BILLING' | 'REMINDER' | 'ALERT' | 'VERIFICATION' | 'GENERAL';
export type SmsDeliveryStatus = 'PENDING' | 'QUEUED' | 'SENT' | 'DELIVERED' | 'FAILED' | 'UNDELIVERED' | 'UNKNOWN';

export interface SmsMessageDto {
    messageId?: string;
    to: string;
    from?: string;
    message: string;
    type?: SmsType;
    priority?: SmsPriority;
    provider?: SmsProvider; // Varsayılan TWILIO, AUTO destekleniyor
    userId?: string;
    clinicId?: number;
    relatedEntityId?: number;
    relatedEntityType?: string;
    category?: SmsCategory;
    scheduledAt?: string; // yyyy-MM-dd HH:mm:ss
    expiresAt?: string; // yyyy-MM-dd HH:mm:ss
    createdAt?: string; // yyyy-MM-dd HH:mm:ss
    triggeredBy?: string;
    retryCount?: number;
    maxRetries?: number;
    metadata?: Record<string, unknown>;
    providerMessageId?: string;
    status?: string;
    deliveryStatus?: SmsDeliveryStatus;
    errorMessage?: string;
    cost?: string;
}

export interface SmsResponseDto {
    messageId?: string;
    providerMessageId?: string;
    provider?: SmsProvider;
    status?: string;
    success: boolean;
    errorMessage?: string;
    errorCode?: string;
    to?: string;
    message?: string;
    cost?: string;
    currency?: string;
    segments?: number;
    responseAt?: string;
    queuedAt?: string;
    sentAt?: string;
    providerMetadata?: unknown;
    deliveryStatus?: SmsDeliveryStatus;
}

export class SmsService {
    // Genel SMS gönderimi (POST /api/sms/send)
    static async sendSms(payload: SmsMessageDto): Promise<SmsResponseDto> {
        return apiClient.post<SmsResponseDto>(`${API_ENDPOINTS.SMS}/send`, payload);
    }

    // Toplu SMS (POST /api/sms/send/bulk)
    static async sendBulk(payload: SmsMessageDto[]): Promise<SmsResponseDto[]> {
        return apiClient.post<SmsResponseDto[]>(`${API_ENDPOINTS.SMS}/send/bulk`, payload);
    }

    // Randevu hatırlatması (POST /api/sms/reminder/appointment)
    static async sendAppointmentReminder(args: {
        phoneNumber: string;
        patientName: string;
        appointmentDate: string;
        clinicName: string;
    }): Promise<SmsResponseDto> {
        const params = new URLSearchParams(args as Record<string, string>);
        return apiClient.post<SmsResponseDto>(`${API_ENDPOINTS.SMS}/reminder/appointment?${params.toString()}`);
    }

    // Doğrulama kodu (POST /api/sms/verification)
    static async sendVerificationCode(args: { phoneNumber: string; verificationCode: string }): Promise<SmsResponseDto> {
        const params = new URLSearchParams(args as Record<string, string>);
        return apiClient.post<SmsResponseDto>(`${API_ENDPOINTS.SMS}/verification?${params.toString()}`);
    }

    // Alarm (POST /api/sms/alert)
    static async sendAlert(args: { phoneNumber: string; alertMessage: string }): Promise<SmsResponseDto> {
        const params = new URLSearchParams(args as Record<string, string>);
        return apiClient.post<SmsResponseDto>(`${API_ENDPOINTS.SMS}/alert?${params.toString()}`);
    }

    // Sağlık durumu (GET /api/sms/health)
    static async health(): Promise<{ smsServiceHealthy: boolean; availableProviders: string[]; providerHealth: Record<string, boolean>; timestamp: string; }> {
        return apiClient.get(`${API_ENDPOINTS.SMS}/health`);
    }

    // Sağlayıcılar (GET /api/sms/providers)
    static async providers(): Promise<{ availableProviders: string[]; providerHealth: Record<string, boolean>; hasAvailableProvider: boolean; timestamp: string; }> {
        return apiClient.get(`${API_ENDPOINTS.SMS}/providers`);
    }

    // Sağlayıcı test (POST /api/sms/test/{provider})
    static async testProvider(provider: 'twilio' | 'netgsm', phoneNumber: string): Promise<Record<string, unknown>> {
        const params = new URLSearchParams({ phoneNumber });
        return apiClient.post(`${API_ENDPOINTS.SMS}/test/${provider}?${params.toString()}`);
    }

    // Konfigürasyon testi (POST /api/sms/test/configuration)
    static async testConfiguration(phoneNumber: string): Promise<Record<string, unknown>> {
        const params = new URLSearchParams({ phoneNumber });
        return apiClient.post(`${API_ENDPOINTS.SMS}/test/configuration?${params.toString()}`);
    }

    // Teslimat durumu (GET /api/sms/status/{providerMessageId}?provider=...)
    static async getDeliveryStatus(providerMessageId: string, provider: 'twilio' | 'netgsm'): Promise<SmsResponseDto> {
        const params = new URLSearchParams({ provider });
        return apiClient.get(`${API_ENDPOINTS.SMS}/status/${encodeURIComponent(providerMessageId)}?${params.toString()}`);
    }
}

export default SmsService;



