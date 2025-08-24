import { LegacyAppointment } from '../features/appointments/types/appointment';

// Google Calendar API Types
interface GoogleCalendarEvent {
    summary: string;
    description: string;
    start: {
        dateTime: string;
        timeZone: string;
    };
    end: {
        dateTime: string;
        timeZone: string;
    };
    location: string;
    reminders: {
        useDefault: boolean;
        overrides: Array<{
            method: string;
            minutes: number;
        }>;
    };
}

interface GoogleAuthConfig {
    clientId: string;
    apiKey: string;
    scope: string;
    discoveryDocs: string[];
}

class GoogleCalendarService {
    private gapi: any = null;
    private isInitialized: boolean = false;
    private authConfig: GoogleAuthConfig;

    constructor() {
        this.authConfig = {
            clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
            apiKey: process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY || '',
            scope: 'https://www.googleapis.com/auth/calendar',
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
        };
    }

    /**
     * Google API'yi başlat
     */
    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            // Google API script'ini yükle
            await this.loadGoogleApiScript();

            // Google API'yi başlat
            await new Promise<void>((resolve, reject) => {
                (window as any).gapi.load('client:auth2', async () => {
                    try {
                        await (window as any).gapi.client.init({
                            apiKey: this.authConfig.apiKey,
                            clientId: this.authConfig.clientId,
                            scope: this.authConfig.scope,
                            discoveryDocs: this.authConfig.discoveryDocs
                        });

                        this.gapi = (window as any).gapi;
                        this.isInitialized = true;
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                });
            });
        } catch (error) {
            console.error('Google API initialization failed:', error);
            throw new Error('Google Calendar servisi başlatılamadı');
        }
    }

    /**
     * Google API script'ini dinamik olarak yükle
     */
    private loadGoogleApiScript(): Promise<void> {
        return new Promise((resolve, reject) => {
            if ((window as any).gapi) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Google API script yüklenemedi'));
            document.head.appendChild(script);
        });
    }

    /**
     * Google hesabına giriş yap
     */
    async signIn(): Promise<boolean> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            const authInstance = this.gapi.auth2.getAuthInstance();
            if (!authInstance.isSignedIn.get()) {
                await authInstance.signIn();
            }
            return true;
        } catch (error) {
            console.error('Google sign in failed:', error);
            return false;
        }
    }

    /**
     * Google hesabından çıkış yap
     */
    async signOut(): Promise<void> {
        if (!this.isInitialized) return;

        try {
            const authInstance = this.gapi.auth2.getAuthInstance();
            await authInstance.signOut();
        } catch (error) {
            console.error('Google sign out failed:', error);
        }
    }

    /**
     * Kullanıcının giriş yapıp yapmadığını kontrol et
     */
    isSignedIn(): boolean {
        if (!this.isInitialized) return false;

        try {
            const authInstance = this.gapi.auth2.getAuthInstance();
            return authInstance.isSignedIn.get();
        } catch (error) {
            return false;
        }
    }

    /**
     * HSS randevusunu Google Calendar event'ine dönüştür
     */
    private convertToGoogleEvent(appointment: LegacyAppointment): GoogleCalendarEvent {
        const startDate = new Date(`${appointment.date}T${appointment.time}`);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 saat sonra

        return {
            summary: `Randevu: ${appointment.patientName} - ${appointment.ownerName}`,
            description: `Hayvan: ${appointment.patientName} (${appointment.breed} ${appointment.petType})
Sahip: ${appointment.ownerName}
Telefon: ${appointment.phone}
Açıklama: ${appointment.description || 'Açıklama yok'}`,
            start: {
                dateTime: startDate.toISOString(),
                timeZone: 'Europe/Istanbul'
            },
            end: {
                dateTime: endDate.toISOString(),
                timeZone: 'Europe/Istanbul'
            },
            location: 'Veteriner Kliniği',
            reminders: {
                useDefault: false,
                overrides: [
                    {
                        method: 'popup',
                        minutes: 15
                    }
                ]
            }
        };
    }

    /**
     * Randevuyu Google Calendar'a ekle
     */
    async addAppointmentToCalendar(appointment: LegacyAppointment): Promise<string> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        if (!this.isSignedIn()) {
            const signedIn = await this.signIn();
            if (!signedIn) {
                throw new Error('Google hesabına giriş yapılamadı');
            }
        }

        try {
            const event = this.convertToGoogleEvent(appointment);

            const response = await this.gapi.client.calendar.events.insert({
                calendarId: 'primary',
                resource: event
            });

            return response.result.id;
        } catch (error) {
            console.error('Google Calendar event creation failed:', error);
            throw new Error('Randevu Google Takvim\'e eklenirken hata oluştu');
        }
    }

    /**
     * Google Calendar'dan event'i sil
     */
    async removeEventFromCalendar(eventId: string): Promise<void> {
        if (!this.isInitialized) return;

        try {
            await this.gapi.client.calendar.events.delete({
                calendarId: 'primary',
                eventId: eventId
            });
        } catch (error) {
            console.error('Google Calendar event deletion failed:', error);
            throw new Error('Event Google Takvim\'den silinirken hata oluştu');
        }
    }

    /**
     * Kullanıcının Google Calendar'larını listele
     */
    async getCalendarList(): Promise<any[]> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            const response = await this.gapi.client.calendar.calendarList.list();
            return response.result.items || [];
        } catch (error) {
            console.error('Calendar list fetch failed:', error);
            return [];
        }
    }
}

// Singleton instance
export const googleCalendarService = new GoogleCalendarService();
export default googleCalendarService;
