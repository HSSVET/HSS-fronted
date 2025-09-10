import { UserProfile, ClinicSettings, User, SystemSettings } from '../types/settings';

export class SettingsService {
  private static baseUrl = '/api/settings';

  // Profile Settings
  static async getUserProfile(): Promise<UserProfile> {
    // Mock data for now
    return {
      id: '1',
      firstName: 'Dr. Ahmet',
      lastName: 'Kaya',
      email: 'ahmet.kaya@example.com',
      phone: '+90 532 123 45 67',
      specialty: 'Genel Veteriner Hekim',
      licenseNumber: '12345'
    };
  }

  static async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    // Mock update
    console.log('Updating profile:', profile);
    return this.getUserProfile();
  }

  // Clinic Settings
  static async getClinicSettings(): Promise<ClinicSettings> {
    // Mock data for now
    return {
      id: '1',
      name: 'Veteriner Klinik',
      address: 'Örnek Mahalle, Veteriner Sok. No: 1',
      city: 'İstanbul',
      phone: '+90 212 123 45 67',
      email: 'info@veterinerklinik.com',
      workingHours: '09:00 - 18:00',
      emergencyPhone: '+90 532 987 65 43'
    };
  }

  static async updateClinicSettings(settings: Partial<ClinicSettings>): Promise<ClinicSettings> {
    // Mock update
    console.log('Updating clinic settings:', settings);
    return this.getClinicSettings();
  }

  // User Management
  static async getUsers(): Promise<User[]> {
    // Mock data for now
    return [
      {
        id: '1',
        name: 'Dr. Ahmet Kaya',
        email: 'ahmet@clinic.com',
        role: 'veteriner',
        active: true,
        createdAt: new Date('2023-01-15')
      },
      {
        id: '2',
        name: 'Elif Demir',
        email: 'elif@clinic.com',
        role: 'asistan',
        active: true,
        createdAt: new Date('2023-02-20')
      }
    ];
  }

  static async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    // Mock create
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    console.log('Creating user:', newUser);
    return newUser;
  }

  static async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    // Mock update
    console.log('Updating user:', userId, userData);
    const users = await this.getUsers();
    return users.find(u => u.id === userId) || users[0];
  }

  static async deleteUser(userId: string): Promise<void> {
    // Mock delete
    console.log('Deleting user:', userId);
  }

  // System Settings
  static async getSystemSettings(): Promise<SystemSettings> {
    // Mock data for now
    return {
      language: 'tr',
      timezone: 'Europe/Istanbul',
      dateFormat: 'DD/MM/YYYY',
      currency: 'TRY',
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        appointmentReminders: true,
        paymentReminders: true,
        emergencyAlerts: true
      }
    };
  }

  static async updateSystemSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    // Mock update
    console.log('Updating system settings:', settings);
    return this.getSystemSettings();
  }
} 