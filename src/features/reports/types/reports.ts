export interface ReportData {
  id: string;
  title: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease';
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
  }[];
}

export interface ReportFilter {
  startDate: Date;
  endDate: Date;
  category?: string;
  type?: string;
}

export interface AnimalReportData extends ReportData {
  species?: string;
  age?: number;
  treatments?: number;
}

export interface AppointmentReportData extends ReportData {
  status: 'completed' | 'cancelled' | 'pending';
  type: string;
}

export interface FinancialReportData extends ReportData {
  amount: number;
  currency: string;
  paymentMethod?: string;
} 