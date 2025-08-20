import React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarMenuProps {
  items: MenuItem[];
  selectedIndex: number;
  onItemSelect: (index: number) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ items, selectedIndex, onItemSelect }) => {
  return (
    <List component="nav" sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {items.map((item, index) => (
        <ListItem key={item.id} disablePadding>
          <ListItemButton
            selected={selectedIndex === index}
            onClick={() => onItemSelect(index)}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: '#92A78C',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#92A78C',
                },
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default SidebarMenu; 