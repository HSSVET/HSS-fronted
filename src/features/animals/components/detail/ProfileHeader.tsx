import React from 'react';
import { Box, Typography, Avatar, Paper } from '@mui/material';

interface AnimalData {
  id: number;
  name: string;
  age: string;
  gender: string;
  height: string;
  chip: string;
  breed: string;
  neutered: string;
  weight: string;
  hospitalStatus: string;
  image: string;
  species: string;
  status?: string;
  behaviorNotes?: string;
  profileImageUrl?: string;
}

interface ProfileHeaderProps {
  animalData: AnimalData;
}

const labelStyle = { color: '#92A78C', fontWeight: 500, minWidth: 120 };
const valueStyle = { color: 'rgba(0, 0, 0, 0.87)', fontWeight: 500 };

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ animalData }) => {
  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3, bgcolor: '#FFFFFF' }}>
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
        <Box>
          <Avatar
            src={animalData.profileImageUrl || animalData.image}
            alt={animalData.name}
            sx={{ width: 120, height: 120, borderRadius: 3, boxShadow: 2 }}
            variant="rounded"
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ color: '#92A78C', mb: 1, fontWeight: 600 }}>
            {animalData.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography sx={labelStyle}>Yaş:</Typography>
                <Typography sx={valueStyle}>{animalData.age}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography sx={labelStyle}>Cinsiyet:</Typography>
                <Typography sx={valueStyle}>{animalData.gender}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography sx={labelStyle}>Boy:</Typography>
                <Typography sx={valueStyle}>{animalData.height}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography sx={labelStyle}>Çip No:</Typography>
                <Typography sx={valueStyle}>{animalData.chip}</Typography>
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography sx={labelStyle}>Tür:</Typography>
                <Typography sx={valueStyle}>{animalData.species}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography sx={labelStyle}>Irk:</Typography>
                <Typography sx={valueStyle}>{animalData.breed}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography sx={labelStyle}>Kısırlık Durumu:</Typography>
                <Typography sx={valueStyle}>{animalData.neutered}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography sx={labelStyle}>Kilo:</Typography>
                <Typography sx={valueStyle}>{animalData.weight}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography sx={labelStyle}>Hastane Durumu:</Typography>
                <Typography sx={valueStyle}>{animalData.hospitalStatus}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Typography sx={labelStyle}>Durum:</Typography>
                <Typography sx={valueStyle}>{animalData.status || 'Aktif'}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProfileHeader; 