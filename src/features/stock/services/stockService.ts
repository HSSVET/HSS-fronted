import {
    Product,
    StockMovement,
    StockAlert,
    StockStats,
    StockSettings,
    ProductCategory,
    ProductUnit,
    MovementType,
    AlertType,
    AlertSeverity,
    ProductFilters,
    MovementFilters
} from '../types';

// Mock Data
export const mockProducts: Product[] = [
    {
        id: 'VAC-RAB-001',
        name: 'Rabies Vaccine',
        code: 'VAC-RAB-001',
        category: ProductCategory.VACCINE,
        unit: ProductUnit.VIAL,
        currentStock: 25,
        minStockLevel: 10,
        expirationDate: '2024-12-15',
        supplier: 'VetSupply Co.',
        price: 45.00,
        description: 'Rabies vaccination for dogs and cats',
        createdAt: '2024-01-15',
        updatedAt: '2024-07-23'
    },
    {
        id: 'MED-AMX-500',
        name: 'Amoxicillin 500mg',
        code: 'MED-AMX-500',
        category: ProductCategory.MEDICATION,
        unit: ProductUnit.BOTTLE,
        currentStock: 5,
        minStockLevel: 15,
        expirationDate: '2024-08-20',
        supplier: 'PharmaCare Ltd.',
        price: 28.50,
        description: 'Antibiotic for bacterial infections',
        createdAt: '2024-02-10',
        updatedAt: '2024-07-20'
    },
    {
        id: 'SUP-GLV-001',
        name: 'Surgical Gloves',
        code: 'SUP-GLV-001',
        category: ProductCategory.SUPPLY,
        unit: ProductUnit.BOX,
        currentStock: 45,
        minStockLevel: 20,
        expirationDate: '2025-06-30',
        supplier: 'MedEquip Inc.',
        price: 12.99,
        description: 'Latex-free surgical gloves, size M',
        createdAt: '2024-01-20',
        updatedAt: '2024-07-15'
    },
    {
        id: 'VAC-FD-002',
        name: 'Feline Distemper Vaccine',
        code: 'VAC-FD-002',
        category: ProductCategory.VACCINE,
        unit: ProductUnit.VIAL,
        currentStock: 8,
        minStockLevel: 12,
        expirationDate: '2024-09-10',
        supplier: 'VetSupply Co.',
        price: 38.75,
        description: 'FVRCP vaccine for cats',
        createdAt: '2024-03-05',
        updatedAt: '2024-07-18'
    },
    {
        id: 'MED-IBU-200',
        name: 'Ibuprofen 200mg',
        code: 'MED-IBU-200',
        category: ProductCategory.MEDICATION,
        unit: ProductUnit.BOTTLE,
        currentStock: 2,
        minStockLevel: 8,
        expirationDate: '2024-07-05',
        supplier: 'PharmaCare Ltd.',
        price: 15.25,
        description: 'Pain relief medication',
        createdAt: '2024-01-10',
        updatedAt: '2024-07-01'
    },
    {
        id: 'MED-HW-001',
        name: 'Heartworm Prevention',
        code: 'MED-HW-001',
        category: ProductCategory.MEDICATION,
        unit: ProductUnit.TABLET,
        currentStock: 120,
        minStockLevel: 50,
        expirationDate: '2025-03-15',
        supplier: 'VetCare Solutions',
        price: 22.50,
        description: 'Monthly heartworm prevention tablets',
        createdAt: '2024-02-01',
        updatedAt: '2024-07-10'
    },
    {
        id: 'SUP-DEN-001',
        name: 'Dental Cleaning Kit',
        code: 'SUP-DEN-001',
        category: ProductCategory.SUPPLY,
        unit: ProductUnit.KIT,
        currentStock: 18,
        minStockLevel: 10,
        expirationDate: '2026-01-20',
        supplier: 'DentalPro Vet',
        price: 85.00,
        description: 'Complete dental cleaning instruments',
        createdAt: '2024-01-25',
        updatedAt: '2024-07-12'
    },
    {
        id: 'VAC-CPV-001',
        name: 'Canine Parvovirus Vaccine',
        code: 'VAC-CPV-001',
        category: ProductCategory.VACCINE,
        unit: ProductUnit.VIAL,
        currentStock: 7,
        minStockLevel: 15,
        expirationDate: '2024-11-30',
        supplier: 'VetSupply Co.',
        price: 42.00,
        description: 'Parvovirus vaccine for dogs',
        createdAt: '2024-03-10',
        updatedAt: '2024-07-22'
    }
];

export const mockMovements: StockMovement[] = [
    {
        id: '1',
        productId: 'VAC-RAB-001',
        productName: 'Rabies Vaccine',
        productCode: 'VAC-RAB-001',
        type: MovementType.INBOUND,
        quantity: 50,
        staffMember: 'Dr. Sarah Johnson',
        date: '2024-07-23',
        supplier: 'VetSupply Co.',
        notes: 'Monthly stock replenishment'
    },
    {
        id: '2',
        productId: 'MED-AMX-500',
        productName: 'Amoxicillin 500mg',
        productCode: 'MED-AMX-500',
        type: MovementType.OUTBOUND,
        quantity: 15,
        staffMember: 'Lisa Chen',
        date: '2024-07-23',
        notes: 'Treatment for patient #12345'
    },
    {
        id: '3',
        productId: 'SUP-GLV-001',
        productName: 'Surgical Gloves',
        productCode: 'SUP-GLV-001',
        type: MovementType.INBOUND,
        quantity: 100,
        staffMember: 'Mike Davis',
        date: '2024-07-22',
        supplier: 'MedEquip Inc.',
        notes: 'Emergency restock'
    },
    {
        id: '4',
        productId: 'VAC-FD-002',
        productName: 'Feline Distemper Vaccine',
        productCode: 'VAC-FD-002',
        type: MovementType.OUTBOUND,
        quantity: 5,
        staffMember: 'Dr. Sarah Johnson',
        date: '2024-07-22',
        notes: 'Vaccination schedule - Cats'
    },
    {
        id: '5',
        productId: 'MED-IBU-200',
        productName: 'Ibuprofen 200mg',
        productCode: 'MED-IBU-200',
        type: MovementType.OUTBOUND,
        quantity: 3,
        staffMember: 'Tom Wilson',
        date: '2024-07-21',
        notes: 'Pain management protocol'
    },
    {
        id: '6',
        productId: 'VAC-RAB-001',
        productName: 'Rabies Vaccine',
        productCode: 'VAC-RAB-001',
        type: MovementType.OUTBOUND,
        quantity: 25,
        staffMember: 'Dr. Sarah Johnson',
        date: '2024-07-21',
        notes: 'Weekly vaccination appointments'
    }
];

export const mockAlerts: StockAlert[] = [
    {
        id: '1',
        productId: 'MED-AMX-500',
        productName: 'Amoxicillin 500mg',
        productCode: 'MED-AMX-500',
        type: AlertType.CRITICAL_STOCK,
        severity: AlertSeverity.CRITICAL,
        message: 'Kritik stok seviyesi',
        date: '2024-07-23'
    },
    {
        id: '2',
        productId: 'MED-IBU-200',
        productName: 'Ibuprofen 200mg',
        productCode: 'MED-IBU-200',
        type: AlertType.EXPIRED,
        severity: AlertSeverity.HIGH,
        message: 'Süresi geçen ürün',
        date: '2024-07-23'
    },
    {
        id: '3',
        productId: 'VAC-FD-002',
        productName: 'Feline Distemper Vaccine',
        productCode: 'VAC-FD-002',
        type: AlertType.LOW_STOCK,
        severity: AlertSeverity.MEDIUM,
        message: 'Düşük stok seviyesi',
        date: '2024-07-22'
    },
    {
        id: '4',
        productId: 'VAC-CPV-001',
        productName: 'Canine Parvovirus Vaccine',
        productCode: 'VAC-CPV-001',
        type: AlertType.LOW_STOCK,
        severity: AlertSeverity.MEDIUM,
        message: 'Düşük stok seviyesi',
        date: '2024-07-22'
    }
];

export const mockStats: StockStats = {
    totalProducts: 124,
    totalStockValue: 2847,
    lowStockAlerts: 18,
    expiredProducts: 5,
    totalInbound: 150,
    totalOutbound: 48,
    netStockIncrease: 102
};

export const mockSettings: StockSettings = {
    autoAlerts: {
        lowStock: true,
        expiration: true,
        autoOrder: false
    },
    stockLevels: {
        minStockWarningPercentage: 20,
        criticalStockPercentage: 10,
        expirationWarningDays: 30
    }
};

// Service Functions
export const stockService = {
    // Products
    async getProducts(filters?: ProductFilters): Promise<Product[]> {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

        let filteredProducts = [...mockProducts];

        if (filters?.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            filteredProducts = filteredProducts.filter(product =>
                product.name.toLowerCase().includes(searchLower) ||
                product.code.toLowerCase().includes(searchLower)
            );
        }

        if (filters?.category) {
            filteredProducts = filteredProducts.filter(product =>
                product.category === filters.category
            );
        }

        if (filters?.status && filters.status !== 'all') {
            const now = new Date();
            filteredProducts = filteredProducts.filter(product => {
                const isExpired = new Date(product.expirationDate) < now;
                const isLow = product.currentStock <= product.minStockLevel;
                const isCritical = product.currentStock <= product.minStockLevel * 0.5;

                switch (filters.status) {
                    case 'expired': return isExpired;
                    case 'critical': return isCritical;
                    case 'low': return isLow && !isCritical;
                    case 'good': return !isLow && !isExpired;
                    default: return true;
                }
            });
        }

        return filteredProducts;
    },

    async getProduct(id: string): Promise<Product | null> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockProducts.find(product => product.id === id) || null;
    },

    async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newProduct: Product = {
            ...product,
            id: `PROD-${Date.now()}`,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
        };
        mockProducts.push(newProduct);
        return newProduct;
    },

    async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = mockProducts.findIndex(product => product.id === id);
        if (index === -1) throw new Error('Product not found');

        mockProducts[index] = {
            ...mockProducts[index],
            ...updates,
            updatedAt: new Date().toISOString().split('T')[0]
        };
        return mockProducts[index];
    },

    async deleteProduct(id: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const index = mockProducts.findIndex(product => product.id === id);
        if (index === -1) throw new Error('Product not found');
        mockProducts.splice(index, 1);
    },

    // Stock Movements
    async getMovements(filters?: MovementFilters): Promise<StockMovement[]> {
        await new Promise(resolve => setTimeout(resolve, 400));

        let filteredMovements = [...mockMovements];

        if (filters?.type) {
            filteredMovements = filteredMovements.filter(movement =>
                movement.type === filters.type
            );
        }

        if (filters?.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            filteredMovements = filteredMovements.filter(movement =>
                movement.productName.toLowerCase().includes(searchLower) ||
                movement.productCode.toLowerCase().includes(searchLower)
            );
        }

        if (filters?.dateRange) {
            filteredMovements = filteredMovements.filter(movement => {
                const movementDate = new Date(movement.date);
                const startDate = new Date(filters.dateRange!.start);
                const endDate = new Date(filters.dateRange!.end);
                return movementDate >= startDate && movementDate <= endDate;
            });
        }

        return filteredMovements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },

    async createMovement(movement: Omit<StockMovement, 'id'>): Promise<StockMovement> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newMovement: StockMovement = {
            ...movement,
            id: Date.now().toString()
        };
        mockMovements.unshift(newMovement);
        return newMovement;
    },

    // Alerts
    async getAlerts(): Promise<StockAlert[]> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockAlerts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },

    // Statistics
    async getStats(): Promise<StockStats> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockStats;
    },

    // Settings
    async getSettings(): Promise<StockSettings> {
        await new Promise(resolve => setTimeout(resolve, 200));
        return mockSettings;
    },

    async updateSettings(settings: StockSettings): Promise<StockSettings> {
        await new Promise(resolve => setTimeout(resolve, 400));
        Object.assign(mockSettings, settings);
        return mockSettings;
    }
}; 