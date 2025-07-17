import React, { useState } from 'react';

interface Supply {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  supplier: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

const SuppliesStock: React.FC = () => {
  const [supplies] = useState<Supply[]>([
    {
      id: '1',
      name: 'Steril Eldiven',
      category: 'Koruyucu Ekipman',
      quantity: 200,
      unit: 'adet',
      price: 1.50,
      supplier: 'MedSupply',
      status: 'in_stock'
    },
    {
      id: '2',
      name: 'Şırınga 5ml',
      category: 'Enjeksiyon',
      quantity: 15,
      unit: 'adet',
      price: 2.00,
      supplier: 'VetTools',
      status: 'low_stock'
    },
    {
      id: '3',
      name: 'Cerrahi Maske',
      category: 'Koruyucu Ekipman',
      quantity: 0,
      unit: 'adet',
      price: 0.75,
      supplier: 'MedSupply',
      status: 'out_of_stock'
    },
    {
      id: '4',
      name: 'Antiseptik',
      category: 'Temizlik',
      quantity: 8,
      unit: 'şişe',
      price: 35.00,
      supplier: 'CleanMed',
      status: 'in_stock'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSupplies = supplies.filter(supply => {
    const matchesFilter = filter === 'all' || supply.status === filter;
    const matchesSearch = supply.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supply.category.toLowerCase().includes(searchTerm.toLowerCase());
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
    <div className="supplies-stock">
      <div className="stock-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Malzeme ara..."
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

      <div className="supplies-table">
        <table>
          <thead>
            <tr>
              <th>Malzeme Adı</th>
              <th>Kategori</th>
              <th>Miktar</th>
              <th>Fiyat</th>
              <th>Tedarikçi</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredSupplies.map(supply => (
              <tr key={supply.id}>
                <td className="supply-name">{supply.name}</td>
                <td>{supply.category}</td>
                <td>{supply.quantity} {supply.unit}</td>
                <td>₺{supply.price.toFixed(2)}</td>
                <td>{supply.supplier}</td>
                <td>
                  <span className={`status ${supply.status}`}>
                    {getStatusText(supply.status)}
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

export default SuppliesStock; 