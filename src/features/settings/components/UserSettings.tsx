import React, { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

const UserSettings: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Dr. Ahmet Kaya', email: 'ahmet@clinic.com', role: 'Veteriner', active: true },
    { id: '2', name: 'Elif Demir', email: 'elif@clinic.com', role: 'Asistan', active: true },
    { id: '3', name: 'Mehmet Özkan', email: 'mehmet@clinic.com', role: 'Teknisyen', active: false }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Asistan'
  });

  const handleToggleUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, active: !user.active } : user
    ));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      id: Date.now().toString(),
      ...newUser,
      active: true
    };
    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'Asistan' });
    setShowAddForm(false);
  };

  return (
    <div className="user-settings">
      <div className="user-header">
        <h2>Kullanıcı Yönetimi</h2>
        <button 
          className="add-user-button"
          onClick={() => setShowAddForm(true)}
        >
          Yeni Kullanıcı Ekle
        </button>
      </div>

      {showAddForm && (
        <div className="add-user-form">
          <h3>Yeni Kullanıcı Ekle</h3>
          <form onSubmit={handleAddUser}>
            <div className="form-group">
              <label>Ad Soyad</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>E-posta</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Rol</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              >
                <option value="Veteriner">Veteriner</option>
                <option value="Asistan">Asistan</option>
                <option value="Teknisyen">Teknisyen</option>
                <option value="Resepsiyonist">Resepsiyonist</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit">Ekle</button>
              <button type="button" onClick={() => setShowAddForm(false)}>İptal</button>
            </div>
          </form>
        </div>
      )}

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>E-posta</th>
              <th>Rol</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span className={`status ${user.active ? 'active' : 'inactive'}`}>
                    {user.active ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleToggleUser(user.id)}
                    className={user.active ? 'deactivate-btn' : 'activate-btn'}
                  >
                    {user.active ? 'Pasifleştir' : 'Aktifleştir'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserSettings; 