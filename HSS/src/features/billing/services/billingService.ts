import { Invoice, Payment, PaymentPlan, Service, BillingStatsData, InvoiceFilters, PaymentFilters, POSTerminal, CardInfo } from '../types';

// Mock POS Terminals - Gerçek klinik ortamında kullanılabilecek
const mockPOSTerminals: POSTerminal[] = [
  { id: 'POS001', name: 'Garanti BBVA POS', serialNumber: 'GB2024001', bank: 'Garanti BBVA', isActive: true },
  { id: 'POS002', name: 'İş Bankası POS', serialNumber: 'IB2024002', bank: 'Türkiye İş Bankası', isActive: true },
  { id: 'POS003', name: 'Akbank POS', serialNumber: 'AK2024003', bank: 'Akbank', isActive: false },
  { id: 'POS004', name: 'Yapı Kredi POS', serialNumber: 'YK2024004', bank: 'Yapı Kredi', isActive: true }
];

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
  },
  {
    id: 3,
    invoiceNumber: 'INV-2024-003',
    patientId: 3,
    patient: { id: 3, name: 'Boncuk', ownerName: 'Mehmet Kaya', ownerPhone: '+90 555 456 7890', ownerEmail: 'mehmet@email.com' },
    issueDate: new Date('2024-01-22'),
    dueDate: new Date('2024-02-22'),
    items: [
      { id: 4, serviceId: 6, service: mockServices[5], quantity: 1, unitPrice: 1500, discount: 100, total: 1400 }
    ],
    subtotal: 1400,
    tax: 252,
    discount: 100,
    total: 1552,
    status: 'paid',
    createdBy: 'Dr. Ahmet Şen',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
  }
];

// Gerçek hayat senaryolarına uygun ödeme mock data'sı
const mockPayments: Payment[] = [
  {
    id: 1,
    invoiceId: 2,
    amount: 177,
    paymentDate: new Date('2024-01-20'),
    paymentMethod: 'credit_card',
    transactionNumber: 'TXN-20240120-001',
    description: 'Aşı ücreti - Kredi kartı ile ödeme',
    status: 'completed',
    posTerminal: mockPOSTerminals[0],
    cardInfo: {
      cardType: 'visa',
      lastFourDigits: '1234',
      bankName: 'Garanti BBVA',
      cardHolderName: 'AYSE DEMIR'
    },
    authorizationCode: 'AUTH123456',
    batchNumber: 'BATCH001',
    notes: 'Başarılı POS işlemi',
    createdBy: 'Dr. Zeynep Kaya',
    createdAt: new Date('2024-01-20')
  },
  {
    id: 2,
    invoiceId: 3,
    amount: 800,
    paymentDate: new Date('2024-01-22'),
    paymentMethod: 'cash',
    transactionNumber: 'TXN-20240122-001',
    description: 'Cerrahi operasyon - Nakit ödeme (1. taksit)',
    status: 'completed',
    cashReceived: 800,
    changeGiven: 0,
    notes: 'Nakit ödeme - İlk taksit',
    createdBy: 'Dr. Ahmet Şen',
    createdAt: new Date('2024-01-22')
  },
  {
    id: 3,
    invoiceId: 3,
    amount: 752,
    paymentDate: new Date('2024-01-22'),
    paymentMethod: 'debit_card',
    transactionNumber: 'TXN-20240122-002',
    description: 'Cerrahi operasyon - Banka kartı ile ödeme (2. taksit)',
    status: 'completed',
    posTerminal: mockPOSTerminals[1],
    cardInfo: {
      cardType: 'mastercard',
      lastFourDigits: '5678',
      bankName: 'Türkiye İş Bankası',
      cardHolderName: 'MEHMET KAYA'
    },
    authorizationCode: 'AUTH789012',
    batchNumber: 'BATCH002',
    notes: 'Banka kartı ile kalan tutar ödendi',
    createdBy: 'Dr. Ahmet Şen',
    createdAt: new Date('2024-01-22')
  },
  {
    id: 4,
    invoiceId: 1,
    amount: 250,
    paymentDate: new Date('2024-01-25'),
    paymentMethod: 'bank_transfer',
    transactionNumber: 'TXN-20240125-001',
    description: 'Muayene ve tahlil - Havale ile ödeme',
    status: 'completed',
    bankAccount: 'TR33 0006 1005 1978 6457 8413 26',
    referenceNumber: 'REF2024012500001',
    notes: 'EFT ile ödeme yapıldı',
    createdBy: 'Dr. Mehmet Öz',
    createdAt: new Date('2024-01-25')
  }
];

// İşlem numarası generator
const generateTransactionNumber = (): string => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = Date.now().toString().slice(-4);
  return `TXN-${dateStr}-${timeStr}`;
};

export const billingService = {
  // POS Terminal operations
  async getPOSTerminals(): Promise<POSTerminal[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPOSTerminals.filter(pos => pos.isActive);
  },

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
    
    if (filters?.status) {
      filtered = filtered.filter(payment => payment.status === filters.status);
    }
    
    if (filters?.posTerminalId) {
      filtered = filtered.filter(payment => payment.posTerminal?.id === filters.posTerminalId);
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(payment => 
        payment.transactionNumber.toLowerCase().includes(searchLower) ||
        payment.description?.toLowerCase().includes(searchLower) ||
        payment.authorizationCode?.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  },

  async createPayment(paymentData: Omit<Payment, 'id' | 'createdAt' | 'transactionNumber'>): Promise<Payment> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newPayment: Payment = {
      ...paymentData,
      id: Date.now(),
      transactionNumber: generateTransactionNumber(),
      createdAt: new Date()
    };
    
    mockPayments.push(newPayment);
    
    // Update invoice status if fully paid
    const invoice = mockInvoices.find(inv => inv.id === paymentData.invoiceId);
    if (invoice) {
      const totalPaid = mockPayments
        .filter(p => p.invoiceId === invoice.id && p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);
      
      if (totalPaid >= invoice.total) {
        invoice.status = 'paid';
        invoice.updatedAt = new Date();
      }
    }
    
    return newPayment;
  },

  // POS Payment simulation
  async processCardPayment(amount: number, posTerminalId: string, cardType: string): Promise<{
    success: boolean;
    authorizationCode?: string;
    batchNumber?: string;
    errorMessage?: string;
  }> {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating POS processing time
    
    const terminal = mockPOSTerminals.find(pos => pos.id === posTerminalId);
    if (!terminal || !terminal.isActive) {
      return { success: false, errorMessage: 'POS terminali aktif değil' };
    }
    
    // %5 başarısızlık oranı simülasyonu
    const success = Math.random() > 0.05;
    
    if (success) {
      return {
        success: true,
        authorizationCode: `AUTH${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        batchNumber: `BATCH${Math.random().toString(36).substr(2, 3).toUpperCase()}`
      };
    } else {
      const errorMessages = [
        'Kartınız okunmadı, lütfen tekrar deneyin',
        'İşlem reddedildi - Yetersiz bakiye',
        'Kart geçerli değil',
        'Banka bağlantı hatası'
      ];
      return { 
        success: false, 
        errorMessage: errorMessages[Math.floor(Math.random() * errorMessages.length)]
      };
    }
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
    
    const completedPayments = mockPayments.filter(p => p.status === 'completed');
    const totalRevenue = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);
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