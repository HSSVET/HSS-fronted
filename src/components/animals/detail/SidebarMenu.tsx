import React from 'react';
import { List, ListItemButton, ListItemText, Box } from '@mui/material';

const menuItems = [
  'Hastalık Geçmişi',
  'Klinik İnceleme',
  'Randevu Takip Sistemi',
  'Radyolojik Görüntüleme',
  'Lab Testleri/Sonuçları',
  'Reçete',
  'Aşılar',
  'Alerji/Kronik Rahatsızlık',
  'Patoloji Bulguları',
  'Nekropsi Bulguları',
  'Not',
];

interface SidebarMenuProps {
  onSelect: (index: number) => void;
  selectedIndex: number;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ onSelect, selectedIndex }) => {
  return (
    <Box sx={{ width: '100%', bgcolor: '#F5F5F5', borderRadius: 3, p: 2 }}>
      <List component="nav">
        {menuItems.map((item, idx) => (
          <ListItemButton
            key={item}
            selected={selectedIndex === idx}
            onClick={() => onSelect(idx)}
            sx={{
              mb: 1,
              borderRadius: 2,
              color: 'rgba(0, 0, 0, 0.87)',
              fontWeight: 500,
              '&.Mui-selected': {
                bgcolor: '#92A78C',
                color: '#fff',
                fontWeight: 700,
              },
              '&:hover': {
                bgcolor: selectedIndex === idx ? '#92A78C' : 'rgba(146, 167, 140, 0.1)',
              },
            }}
          >
            <ListItemText primary={item} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default SidebarMenu; 