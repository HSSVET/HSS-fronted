export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  licenseNumber: string;
  avatar?: string;
}

export interface ClinicSettings {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  workingHours: string;
  emergencyPhone: string;
  website?: string;
  logo?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export type UserRole = 'admin' | 'veteriner' | 'asistan' | 'teknisyen' | 'resepsiyonist';

export interface SystemSettings {
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  paymentReminders: boolean;
  emergencyAlerts: boolean;
} 