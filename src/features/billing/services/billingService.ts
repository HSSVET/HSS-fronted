import { Invoice, Payment, PaymentPlan, Service, BillingStatsData, InvoiceFilters, PaymentFilters } from '../types';

// Mock data - gerçek uygulamada API'den gelecek
const mockServices: Service[] = [
  { id: 1, name: 'Genel Muayene', description: 'Rutin veteriner muayenesi', price: 200, category: 'examination' },
  { id: 2, name: 'Aşı Uygulaması', description: 'Zorunlu aşı uygulaması', price: 150, category: 'vaccination' },
  { id: 3, name: 'Kan Tahlili', description: 'Kapsamlı kan analizi', price: 300, category: 'laboratory' },
  { id: 4, name: 'Röntgen', description: 'X-Ray görüntüleme', price: 400, category: 'examination' },
  { id: 5, name: 'Ultrason', description: 'Ultrasonografi', price: 350, category: 'examination' },
  { id: 6, name: 'Cerrahi Operasyon', description: 'Genel cerrahi müdahale', price: 1500, category: 'surgery' },
  { id: 7, name: 'Acil Müdahale', description: '7/24 acil veteriner hizmeti', price: 500, category: 'emergency' },
  { id: 8, name: 'Diş Temizliği', description: 'Profesyonel diş bakımı', price: 250, category: 'other' },
];

const mockInvoices: Invoice[] = [
  {
    id: 1,
    invoiceNumber: 'INV-2024-001',
    patientId: 1,
    patient: { id: 1, name: 'Max', ownerName: 'Ahmet Yılmaz', ownerPhone: '+90 555 123 4567', ownerEmail: 'ahmet@email.com' },
    issueDate: new Date('2024-01-15'),
    dueDate: new Date('2024-02-15'),
    items: [
      { id: 1, serviceId: 1, service: mockServices[0], quantity: 1, unitPrice: 200, discount: 0, total: 200 },
      { id: 2, serviceId: 3, service: mockServices[2], quantity: 1, unitPrice: 300, discount: 50, total: 250 }
    ],
    subtotal: 450,
    tax: 81,
    discount: 50,
    total: 481,
    status: 'sent',
    notes: 'Rutin kontrol ve kan tahlili yapıldı.',
    createdBy: 'Dr. Mehmet Öz',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 2,
    invoiceNumber: 'INV-2024-002',
    patientId: 2,
    patient: { id: 2, name: 'Pamuk', ownerName: 'Ayşe Demir', ownerPhone: '+90 555 987 6543', ownerEmail: 'ayse@email.com' },
    issueDate: new Date('2024-01-18'),
    dueDate: new Date('2024-02-18'),
    items: [
      { id: 3, serviceId: 2, service: mockServices[1], quantity: 1, unitPrice: 150, discount: 0, total: 150 }
    ],
    subtotal: 150,
    tax: 27,
    discount: 0,
    total: 177,
    status: 'paid',
    createdBy: 'Dr. Zeynep Kaya',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-20')
  }
];

const mockPayments: Payment[] = [
  {
    id: 1,
    invoiceId: 2,
    amount: 177,
    paymentDate: new Date('2024-01-20'),
    paymentMethod: 'credit_card',
    transactionId: 'TXN-001-2024',
    notes: 'Kredi kartı ile ödeme',
    createdBy: 'Dr. Zeynep Kaya',
    createdAt: new Date('2024-01-20')
  }
];

export const billingService = {
  // Invoice operations
  async getInvoices(filters?: InvoiceFilters): Promise<Invoice[]> {
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 500));
    let filtered = [...mockInvoices];
    
    if (filters?.status) {
      filtered = filtered.filter(invoice => invoice.status === filters.status);
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
        invoice.patient.name.toLowerCase().includes(searchLower) ||
        invoice.patient.ownerName.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  },

  async getInvoiceById(id: number): Promise<Invoice | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockInvoices.find(invoice => invoice.id === id) || null;
  },

  async createInvoice(invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newInvoice: Invoice = {
      ...invoiceData,
      id: Date.now(),
      invoiceNumber: `INV-2024-${String(mockInvoices.length + 1).padStart(3, '0')}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockInvoices.push(newInvoice);
    return newInvoice;
  },

  async updateInvoice(id: number, updates: Partial<Invoice>): Promise<Invoice> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = mockInvoices.findIndex(invoice => invoice.id === id);
    if (index === -1) throw new Error('Fatura bulunamadı');
    
    mockInvoices[index] = { ...mockInvoices[index], ...updates, updatedAt: new Date() };
    return mockInvoices[index];
  },

  async deleteInvoice(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockInvoices.findIndex(invoice => invoice.id === id);
    if (index === -1) throw new Error('Fatura bulunamadı');
    mockInvoices.splice(index, 1);
  },

  // Payment operations
  async getPayments(filters?: PaymentFilters): Promise<Payment[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    let filtered = [...mockPayments];
    
    if (filters?.paymentMethod) {
      filtered = filtered.filter(payment => payment.paymentMethod === filters.paymentMethod);
    }
    
    return filtered;
  },

  async createPayment(paymentData: Omit<Payment, 'id' | 'createdAt'>): Promise<Payment> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newPayment: Payment = {
      ...paymentData,
      id: Date.now(),
      createdAt: new Date()
    };
    mockPayments.push(newPayment);
    
    // Update invoice status if fully paid
    const invoice = mockInvoices.find(inv => inv.id === paymentData.invoiceId);
    if (invoice) {
      const totalPaid = mockPayments
        .filter(p => p.invoiceId === invoice.id)
        .reduce((sum, p) => sum + p.amount, 0);
      
      if (totalPaid >= invoice.total) {
        invoice.status = 'paid';
        invoice.updatedAt = new Date();
      }
    }
    
    return newPayment;
  },

  // Service operations
  async getServices(): Promise<Service[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockServices];
  },

  async createService(serviceData: Omit<Service, 'id'>): Promise<Service> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newService: Service = {
      ...serviceData,
      id: Date.now()
    };
    mockServices.push(newService);
    return newService;
  },

  // Statistics
  async getBillingStats(): Promise<BillingStatsData> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const totalRevenue = mockPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const pendingInvoices = mockInvoices.filter(inv => inv.status === 'sent');
    const overdueInvoices = mockInvoices.filter(inv => inv.status === 'overdue');
    const paidInvoices = mockInvoices.filter(inv => inv.status === 'paid');
    
    return {
      totalRevenue,
      pendingPayments: pendingInvoices.reduce((sum, inv) => sum + inv.total, 0),
      overduePayments: overdueInvoices.reduce((sum, inv) => sum + inv.total, 0),
      monthlyRevenue: totalRevenue, // Simplified for now
      totalInvoices: mockInvoices.length,
      paidInvoices: paidInvoices.length,
      unpaidInvoices: mockInvoices.length - paidInvoices.length
    };
  }
}; 