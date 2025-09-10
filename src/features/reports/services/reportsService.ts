import { ReportData, ReportFilter, AnimalReportData, AppointmentReportData, FinancialReportData } from '../types/reports';

export class ReportsService {
  private static baseUrl = '/api/reports';

  static async getAnimalReports(filter?: ReportFilter): Promise<AnimalReportData[]> {
    // Mock data for now
    return [
      { id: '1', title: 'Toplam Hayvan', value: 156 },
      { id: '2', title: 'Bu Ay Kayıt', value: 12, change: 15, changeType: 'increase' },
      { id: '3', title: 'Aktif Tedavi', value: 23 },
      { id: '4', title: 'Aşı Bekleyen', value: 8 }
    ];
  }

  static async getAppointmentReports(filter?: ReportFilter): Promise<AppointmentReportData[]> {
    // Mock data for now
    return [
      { id: '1', title: 'Toplam Randevu', value: 89, status: 'completed', type: 'checkup' },
      { id: '2', title: 'Tamamlanan', value: 76, status: 'completed', type: 'checkup' },
      { id: '3', title: 'İptal Edilen', value: 8, status: 'cancelled', type: 'checkup' },
      { id: '4', title: 'Bekleyen', value: 5, status: 'pending', type: 'checkup' }
    ];
  }

  static async getFinancialReports(filter?: ReportFilter): Promise<FinancialReportData[]> {
    // Mock data for now
    return [
      { id: '1', title: 'Bu Ay Gelir', value: '₺45,670', amount: 45670, currency: 'TRY' },
      { id: '2', title: 'Bekleyen Ödeme', value: '₺12,340', amount: 12340, currency: 'TRY' },
      { id: '3', title: 'Tamamlanan', value: '₺33,330', amount: 33330, currency: 'TRY' },
      { id: '4', title: 'Ortalama Fatura', value: '₺285', amount: 285, currency: 'TRY' }
    ];
  }

  static async exportReport(type: string, format: 'pdf' | 'excel', filter?: ReportFilter): Promise<Blob> {
    // Mock export functionality
    return new Blob(['Mock report data'], { type: 'application/pdf' });
  }
} 