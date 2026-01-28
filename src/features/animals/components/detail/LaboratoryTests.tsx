import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import { useLabTestsByAnimal } from '../../../laboratory/hooks/useLaboratoryQueries';
import '../../styles/LaboratoryTests.css';
import type { LabTest, LabResult } from '../../../laboratory/types/laboratory';
import { LaboratoryService } from '../../../laboratory/services/laboratoryService';

interface LaboratoryTestsProps {
  animalId?: string;
}

const LaboratoryTests: React.FC<LaboratoryTestsProps> = ({ animalId }) => {
  const [expandedPanel, setExpandedPanel] = useState<string | false>(false);
  const { data: response, isLoading, error } = useLabTestsByAnimal(animalId);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Test sonuçları yüklenirken bir hata oluştu.</Alert>
      </Box>
    );
  }

  const labTests = response?.data || [];

  const openFileView = async (fileUrl: string) => {
    try {
      if (fileUrl.startsWith('http') && !fileUrl.includes('storage.googleapis.com')) {
        window.open(fileUrl, '_blank');
        return;
      }
      const response = await LaboratoryService.getSignedUrl(fileUrl);
      if (response.success && response.data.signedUrl) {
        window.open(response.data.signedUrl, '_blank');
      } else {
        console.error('Failed to get signed URL');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const renderTestResult = (result: LabResult) => (
    <Box key={result.resultId} sx={{
      display: 'flex',
      justifyContent: 'space-between',
      mb: 1,
      p: 1,
      borderBottom: '1px solid #eee',
      '&:last-child': { borderBottom: 'none' }
    }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {result.result || 'Sonuç'}
        </Typography>
        {result.interpretation && (
          <Typography variant="caption" display="block" color="text.secondary">
            Yorum: {result.interpretation}
          </Typography>
        )}
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
          <Typography variant="body2" fontWeight="bold">
            {result.value} {result.unit}
          </Typography>
          {result.fileUrl && (
            <Button
              size="small"
              startIcon={<DescriptionIcon />}
              onClick={() => openFileView(result.fileUrl!)}
            >
              Dosya
            </Button>
          )}
        </Box>
        {result.normalRange && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            Ref: ({result.normalRange})
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: 2 }} className="laboratory-tests">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Laboratuvar Testleri
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ bgcolor: '#92A78C', '&:hover': { bgcolor: '#7C8F77' } }}
          >
            Yeni Test
          </Button>
        </Box>
      </Box>

      {labTests.length === 0 ? (
        <Alert severity="info">Bu hasta için kayıtlı laboratuvar testi bulunmamaktadır.</Alert>
      ) : (
        labTests.map((test) => (
          <Accordion
            key={test.testId}
            expanded={expandedPanel === `test-${test.testId}`}
            onChange={handleChange(`test-${test.testId}`)}
            sx={{ mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', mr: 2 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {test.testName}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {test.date}
                  </Typography>
                  <Chip
                    label={test.status}
                    size="small"
                    color={test.status === 'COMPLETED' ? 'success' : test.status === 'PENDING' ? 'warning' : 'default'}
                    variant="outlined"
                  />
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {test.results && test.results.length > 0 ? (
                <Box>
                  {test.results.map(renderTestResult)}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Henüz sonuç girilmemiş.
                </Typography>
              )}

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                  size="small"
                  startIcon={<PrintIcon />}
                  variant="outlined"
                >
                  Yazdır
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
};

export default LaboratoryTests;