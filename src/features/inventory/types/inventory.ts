export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  supplier: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  createdAt: Date;
  updatedAt: Date;
}

export interface Medicine extends InventoryItem {
  expiryDate: Date;
  batchNumber?: string;
  activeIngredient?: string;
  dosageForm?: string;
  strength?: string;
}

export interface Supply extends InventoryItem {
  description?: string;
  specifications?: string;
  brand?: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  date: Date;
  userId: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  products: string[];
}

export interface InventoryFilter {
  category?: string;
  status?: 'in_stock' | 'low_stock' | 'out_of_stock';
  supplier?: string;
  searchTerm?: string;
  search?: string;
}

export interface InventoryStats {
  totalItems: number;
  lowStockItems: number;
  expiringSoon: number;
  totalValue: number;
  monthlyUsage: number;
} 