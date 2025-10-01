// Stock Types
export interface Product {
    id: string;
    name: string;
    code: string;
    category: ProductCategory;
    unit: ProductUnit;
    currentStock: number;
    minStockLevel: number;
    expirationDate: string;
    supplier: string;
    price: number;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface StockMovement {
    id: string;
    productId: string;
    productName: string;
    productCode: string;
    type: MovementType;
    quantity: number;
    staffMember: string;
    date: string;
    supplier?: string;
    notes?: string;
}

export interface StockAlert {
    id: string;
    productId: string;
    productName: string;
    productCode: string;
    type: AlertType;
    severity: AlertSeverity;
    message: string;
    date: string;
}

export interface StockStats {
    totalProducts: number;
    totalStockValue: number;
    lowStockAlerts: number;
    expiredProducts: number;
    totalInbound: number;
    totalOutbound: number;
    netStockIncrease: number;
}

export interface StockSettings {
    autoAlerts: {
        lowStock: boolean;
        expiration: boolean;
        autoOrder: boolean;
    };
    stockLevels: {
        minStockWarningPercentage: number;
        criticalStockPercentage: number;
        expirationWarningDays: number;
    };
}

// Enums
export enum ProductCategory {
    MEDICATION = 'medication',
    VACCINE = 'vaccine',
    SUPPLY = 'supply',
    EQUIPMENT = 'equipment'
}

export enum ProductUnit {
    VIAL = 'vial',
    BOTTLE = 'bottle',
    BOX = 'box',
    PIECE = 'piece',
    KIT = 'kit',
    TABLET = 'tablet'
}

export enum MovementType {
    INBOUND = 'inbound',
    OUTBOUND = 'outbound'
}

export enum AlertType {
    LOW_STOCK = 'low_stock',
    CRITICAL_STOCK = 'critical_stock',
    EXPIRING_SOON = 'expiring_soon',
    EXPIRED = 'expired'
}

export enum AlertSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

// Filter Types
export interface ProductFilters {
    category?: ProductCategory;
    status?: 'all' | 'good' | 'low' | 'critical' | 'expired';
    searchTerm?: string;
}

export interface MovementFilters {
    type?: MovementType;
    dateRange?: {
        start: string;
        end: string;
    };
    searchTerm?: string;
}

// Chart Data Types
export interface ChartData {
    labels: string[];
    datasets: ChartDataset[];
}

export interface ChartDataset {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
}

// API Response Types
export interface StockResponse {
    products: Product[];
    movements: StockMovement[];
    alerts: StockAlert[];
    stats: StockStats;
} 