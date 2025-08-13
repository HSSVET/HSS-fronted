// Components
export { default as ReminderManagement } from './components/ReminderManagement';
export { default as RemindersPage } from './components/RemindersPage';

// Services
export { ReminderService } from './services/reminderService';
export type { 
  Reminder, 
  CreateReminderRequest, 
  SystemStatus, 
  ApiResponse 
} from './services/reminderService';

// Types (if we need additional types in the future)
export interface ReminderStats {
  totalReminders: number;
  pendingCount: number;
  sentCount: number;
  failedCount: number;
}

export interface ReminderConfig {
  smsEnabled: boolean;
  emailEnabled: boolean;
  autoCreateEnabled: boolean;
  processInterval: number;
}
