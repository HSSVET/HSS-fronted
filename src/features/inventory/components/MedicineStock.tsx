import React, { useState } from 'react';

interface Medicine {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  price: number;
  supplier: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

const MedicineStock: React.FC = () => {
  const [medicines] = useState<Medicine[]>([
    {
      id: '1',
      name: 'Amoxicillin',
      category: 'Antibiyotik',
      quantity: 50,
      unit: 'adet',
      expiryDate: '2024-12-31',
      price: 25.50,
      supplier: 'VetPharm',
      status: 'in_stock'
    },
    {
      id: '2',
      name: 'Vitamin B12',
      category: 'Vitamin',
      quantity: 5,
      unit: 'adet',
      expiryDate: '2024-08-15',
      price: 45.00,
      supplier: 'VetCare',
      status: 'low_stock'
    },
    {
      id: '3',
      name: 'Anestezi',
      category: 'Anestezi',
      quantity: 0,
      unit: 'ml',
      expiryDate: '2024-06-30',
      price: 120.00,
      supplier: 'MediVet',
      status: 'out_of_stock'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMedicines = medicines.filter(medicine => {
    const matchesFilter = filter === 'all' || medicine.status === filter;
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_stock': return 'Stokta';
      case 'low_stock': return 'Düşük Stok';
      case 'out_of_stock': return 'Tükendi';
      default: return status;
    }
  };

  return (
    <div className="medicine-stock">
      <div className="stock-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="İlaç ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            Tümü
          </button>
          <button 
            className={filter === 'in_stock' ? 'active' : ''}
            onClick={() => setFilter('in_stock')}
          >
            Stokta
          </button>
          <button 
            className={filter === 'low_stock' ? 'active' : ''}
            onClick={() => setFilter('low_stock')}
          >
            Düşük Stok
          </button>
          <button 
            className={filter === 'out_of_stock' ? 'active' : ''}
            onClick={() => setFilter('out_of_stock')}
          >
            Tükendi
          </button>
        </div>
      </div>

      <div className="medicines-table">
        <table>
          <thead>
            <tr>
              <th>İlaç Adı</th>
              <th>Kategori</th>
              <th>Miktar</th>
              <th>Son Kullanma</th>
              <th>Fiyat</th>
              <th>Tedarikçi</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map(medicine => (
              <tr key={medicine.id}>
                <td className="medicine-name">{medicine.name}</td>
                <td>{medicine.category}</td>
                <td>{medicine.quantity} {medicine.unit}</td>
                <td>{medicine.expiryDate}</td>
                <td>₺{medicine.price.toFixed(2)}</td>
                <td>{medicine.supplier}</td>
                <td>
                  <span className={`status ${medicine.status}`}>
                    {getStatusText(medicine.status)}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-btn">Düzenle</button>
                    <button className="restock-btn">Stok Ekle</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicineStock; 