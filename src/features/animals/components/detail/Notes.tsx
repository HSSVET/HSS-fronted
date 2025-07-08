import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PrintIcon from '@mui/icons-material/Print';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';

interface Note {
  id: string;
  date: string;
  doctor: string;
  content: string;
}

interface NotesProps {
  onAddClick?: () => void;
}

const mockNotes: Note[] = [
  {
    id: '1',
    date: '15.08.2023',
    doctor: 'Dr. Ayşe Demir',
    content: 'Hasta sahibi düzenli ilaç kullanımı konusunda tekrar bilgilendirildi. Antibiyotik tedavisinin tamamlanmasının önemini vurguladık. Hasta sahibi anlayış gösterdi ve geri kalan tedaviyi tamamlayacağını belirtti.'
  },
  {
    id: '2',
    date: '25.09.2023',
    doctor: 'Dr. Mehmet Yılmaz',
    content: 'Yaşına göre iyi durumda. Kilo takibi önerildi. Mevcut diyetine devam etmesi gerektiği konusunda uyarıldı. Aylık tartım ve 3 ayda bir kontrol önerildi. Diyet programında herhangi bir değişiklik gerekmemektedir.'
  }
];

const Notes: React.FC<NotesProps> = ({ onAddClick }) => {
  const handlePrint = (note: Note) => {
    // Print functionality
    console.log('Print note:', note);
  };

  const handleCopy = (note: Note) => {
    // Copy functionality
    navigator.clipboard.writeText(note.content);
  };

  const handleEdit = (note: Note) => {
    // Edit functionality
    console.log('Edit note:', note);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#1976d2' }}>
          Notlar
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddClick}
          sx={{
            bgcolor: '#1976d2',
            '&:hover': {
              bgcolor: '#1565c0',
            },
          }}
        >
          Yeni Not Ekle
        </Button>
      </Box>

      {mockNotes.map((note) => (
        <Paper
          key={note.id}
          elevation={1}
          sx={{
            p: 3,
            mb: 2,
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            bgcolor: '#f8f9fa'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DescriptionIcon sx={{ color: '#1976d2' }} />
              <Typography variant="subtitle1" sx={{ color: '#1976d2' }}>
                {note.date}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon sx={{ color: '#666' }} />
              <Typography variant="subtitle1" sx={{ color: '#666' }}>
                {note.doctor}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
            {note.content}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Tooltip title="Yazdır">
              <IconButton
                size="small"
                onClick={() => handlePrint(note)}
                sx={{ color: '#666' }}
              >
                <PrintIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Detaylar">
              <IconButton
                size="small"
                sx={{ color: '#666' }}
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Kopyala">
              <IconButton
                size="small"
                onClick={() => handleCopy(note)}
                sx={{ color: '#666' }}
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Düzenle">
              <IconButton
                size="small"
                onClick={() => handleEdit(note)}
                sx={{ color: '#666' }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default Notes; 