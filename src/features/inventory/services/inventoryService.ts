import { InventoryItem, Medicine, Supply, StockMovement, InventoryFilter, InventoryStats } from '../types/inventory';

export class InventoryService {
  private static baseUrl = '/api/inventory';

  // Inventory Items
  static async getInventoryItems(filter?: InventoryFilter): Promise<InventoryItem[]> {
    // Mock data for now
    return [
      {
        id: '1',
        name: 'Amoxicillin',
        category: 'Antibiyotik',
        quantity: 50,
        unit: 'adet',
        price: 25.50,
        supplier: 'VetPharm',
        status: 'in_stock',
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: '2',
        name: 'Steril Eldiven',
        category: 'Koruyucu Ekipman',
        quantity: 200,
        unit: 'adet',
        price: 1.50,
        supplier: 'MedSupply',
        status: 'in_stock',
        createdAt: new Date('2023-02-01'),
        updatedAt: new Date('2024-01-18')
      }
    ];
  }

  static async getMedicines(filter?: InventoryFilter): Promise<Medicine[]> {
    // Mock data for now
    return [
      {
        id: '1',
        name: 'Amoxicillin',
        category: 'Antibiyotik',
        quantity: 50,
        unit: 'adet',
        price: 25.50,
        supplier: 'VetPharm',
        status: 'in_stock',
        expiryDate: new Date('2024-12-31'),
        batchNumber: 'AMX-2024-001',
        activeIngredient: 'Amoxicillin Trihydrate',
        dosageForm: 'Tablet',
        strength: '500mg',
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2024-01-20')
      }
    ];
  }

  static async getSupplies(filter?: InventoryFilter): Promise<Supply[]> {
    // Mock data for now
    return [
      {
        id: '2',
        name: 'Steril Eldiven',
        category: 'Koruyucu Ekipman',
        quantity: 200,
        unit: 'adet',
        price: 1.50,
        supplier: 'MedSupply',
        status: 'in_stock',
        description: 'Latex-free disposable gloves',
        specifications: 'Size: Medium, Powder-free',
        brand: 'SafeHands',
        createdAt: new Date('2023-02-01'),
        updatedAt: new Date('2024-01-18')
      }
    ];
  }

  static async addInventoryItem(item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem> {
    // Mock create
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    console.log('Adding inventory item:', newItem);
    return newItem;
  }

  static async updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> {
    // Mock update
    console.log('Updating inventory item:', id, updates);
    const items = await this.getInventoryItems();
    return items.find(item => item.id === id) || items[0];
  }

  static async deleteInventoryItem(id: string): Promise<void> {
    // Mock delete
    console.log('Deleting inventory item:', id);
  }

  // Stock Movements
  static async getStockMovements(itemId?: string): Promise<StockMovement[]> {
    // Mock data for now
    return [
      {
        id: '1',
        itemId: '1',
        type: 'in',
        quantity: 100,
        reason: 'Purchase',
        date: new Date('2024-01-15'),
        userId: 'user1',
        notes: 'New stock from supplier'
      },
      {
        id: '2',
        itemId: '1',
        type: 'out',
        quantity: 50,
        reason: 'Treatment',
        date: new Date('2024-01-20'),
        userId: 'user2',
        notes: 'Used for patient treatment'
      }
    ];
  }

  static async addStockMovement(movement: Omit<StockMovement, 'id'>): Promise<StockMovement> {
    // Mock create
    const newMovement: StockMovement = {
      ...movement,
      id: Date.now().toString()
    };
    console.log('Adding stock movement:', newMovement);
    return newMovement;
  }

  // Statistics
  static async getInventoryStats(): Promise<InventoryStats> {
    // Mock data for now
    return {
      totalItems: 245,
      lowStockItems: 12,
      expiringSoon: 3,
      totalValue: 125450,
      monthlyUsage: 8450
    };
  }

  // Search and Filter
  static async searchInventory(query: string): Promise<InventoryItem[]> {
    const items = await this.getInventoryItems();
    return items.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Low Stock Alert
  static async getLowStockItems(threshold: number = 10): Promise<InventoryItem[]> {
    const items = await this.getInventoryItems();
    return items.filter(item => item.quantity <= threshold);
  }

  // Expiring Soon
  static async getExpiringSoonItems(days: number = 30): Promise<Medicine[]> {
    const medicines = await this.getMedicines();
    const today = new Date();
    const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
    
    return medicines.filter(medicine => 
      medicine.expiryDate <= futureDate && medicine.expiryDate > today
    );
  }
} 