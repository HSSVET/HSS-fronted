import React, { useState } from 'react';
import { Box, Typography, Button, Paper, ButtonGroup } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';

type ImagingType = 'Röntgen' | 'USG' | 'EKG' | 'BT' | 'EMR';

interface ImagingRecord {
  id: number;
  date: string;
  type: ImagingType;
  region: string;
  findings: string;
  notes: string;
  imageUrl: string;
}

const RadiologyImaging: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ImagingType>('Röntgen');

  // Mock data - will be replaced with real data from API
  const imagingRecords: ImagingRecord[] = [
    {
      id: 1,
      date: '15.08.2023',
      type: 'Röntgen',
      region: 'Toraks',
      findings: 'Akciğer ve kalp silueti normal. Patolojik bulgu saptanmadı.',
      notes: 'Rutin yıllık kontrol amaçlı çekildi.',
      imageUrl: '/assets/xray-sample.jpg'
    },
    {
      id: 2,
      date: '16.08.2023',
      type: 'USG',
      region: 'Abdomen',
      findings: 'Hafif karaciğer büyümesi, diğer organlar normal görünümde.',
      notes: 'Karaciğer enzim yüksekliği nedeniyle çekildi.',
      imageUrl: '/assets/usg-sample.jpg'
    },
    {
      id: 3,
      date: '20.09.2023',
      type: 'EKG',
      region: 'Kardiyak',
      findings: 'Normal sinüs ritmi. Kalp hızı: 120 atım/dk. PR interval ve QRS kompleksi normal sınırlarda.',
      notes: 'Pre-operatif değerlendirme için çekildi.',
      imageUrl: '/assets/ekg-sample.jpg'
    },
    {
      id: 4,
      date: '05.10.2023',
      type: 'BT',
      region: 'Baş',
      findings: 'Sağ kulak kanalında hafif inflamasyon. İç kulak yapıları normal.',
      notes: 'Tekrarlayan otit şikayeti nedeniyle yapıldı.',
      imageUrl: '/assets/ct-sample.jpg'
    },
    {
      id: 5,
      date: '12.10.2023',
      type: 'EMR',
      region: 'Lumbosakral',
      findings: 'L4-L5 arasında hafif disk protrüzyonu. Spinal kord basısı yok.',
      notes: 'Arka ayak zayıflığı şikayeti için inceleme yapıldı.',
      imageUrl: '/assets/mri-sample.jpg'
    }
  ];

  const filteredRecords = imagingRecords.filter(record => record.type === selectedType);

  return (
    <Box>
      <Typography variant="h6" sx={{ color: '#92A78C', fontWeight: 600, mb: 3 }}>
        Radyolojik Görüntüleme
      </Typography>

      <ButtonGroup 
        variant="outlined" 
        sx={{ 
          mb: 4,
          '& .MuiButton-root': {
            color: '#666',
            borderColor: '#e0e0e0',
            '&.active': {
              bgcolor: '#52A7F7',
              color: '#fff',
              '&:hover': {
                bgcolor: '#1976D2'
              }
            },
            '&:hover': {
              borderColor: '#52A7F7',
              bgcolor: 'rgba(82, 167, 247, 0.04)'
            }
          }
        }}
      >
        {(['Röntgen', 'USG', 'EKG', 'BT', 'EMR'] as ImagingType[]).map((type) => (
          <Button
            key={type}
            className={selectedType === type ? 'active' : ''}
            onClick={() => setSelectedType(type)}
          >
            {type}
          </Button>
        ))}
      </ButtonGroup>

      {filteredRecords.map((record) => (
        <Paper
          key={record.id}
          elevation={1}
          sx={{
            p: 3,
            mb: 2,
            borderRadius: 2,
            border: '1px solid #E0E0E0'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                {record.date}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                {record.region}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
              Bulgular
            </Typography>
            <Typography variant="body1">
              {record.findings}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
              Notlar
            </Typography>
            <Typography variant="body1">
              {record.notes}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <img
                src={record.imageUrl}
                alt={`${record.type} görüntüsü`}
                style={{
                  width: '100%',
                  maxWidth: 300,
                  height: 'auto',
                  borderRadius: 8,
                  border: '1px solid #e0e0e0'
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<OpenInFullIcon />}
                sx={{
                  color: '#52A7F7',
                  borderColor: '#52A7F7',
                  '&:hover': {
                    borderColor: '#1976D2',
                    bgcolor: 'rgba(82, 167, 247, 0.04)'
                  }
                }}
              >
                Tam Boyut Görüntüle
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<FileDownloadIcon />}
                sx={{
                  color: '#92A78C',
                  borderColor: '#92A78C',
                  '&:hover': {
                    borderColor: '#7B8B76',
                    bgcolor: 'rgba(146, 167, 140, 0.04)'
                  }
                }}
              >
                İndir
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<PrintIcon />}
                sx={{
                  color: '#92A78C',
                  borderColor: '#92A78C',
                  '&:hover': {
                    borderColor: '#7B8B76',
                    bgcolor: 'rgba(146, 167, 140, 0.04)'
                  }
                }}
              >
                Yazdır
              </Button>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default RadiologyImaging; 