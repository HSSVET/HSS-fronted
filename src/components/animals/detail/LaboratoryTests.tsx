import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Grid,
  Button,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import '../../../styles/components/LaboratoryTests.css';

interface TestResult {
  value: string | number;
  referenceRange?: string;
  status?: 'normal' | 'abnormal' | 'pending';
}

interface HemogramResults {
  RBC: TestResult;
  HGB: TestResult;
  WBC: TestResult;
  HCT: TestResult;
  PCV: TestResult;
  MCH: TestResult;
  MCHC: TestResult;
  PLT: TestResult;
  MPV: TestResult;
  PCT: TestResult;
  EO: TestResult;
  MONO: TestResult;
  NEU: TestResult;
  LYM: TestResult;
}

interface BiochemistryResults {
  ALT: TestResult;
  AST: TestResult;
  ALP: TestResult;
  GGT: TestResult;
  TBIL: TestResult;
  DBIL: TestResult;
  UREA: TestResult;
  CREATININE: TestResult;
  SDMA: TestResult;
  GLUCOSE: TestResult;
  LACTATE: TestResult;
  TRIGLYCERIDES: TestResult;
  TOTAL_PROTEIN: TestResult;
  ALBUMIN: TestResult;
  GLOBULIN: TestResult;
  NA: TestResult;
  K: TestResult;
  CL: TestResult;
  P: TestResult;
  MG: TestResult;
  AMYLASE: TestResult;
  LIPASE: TestResult;
  TLI: TestResult;
  PLI: TestResult;
}

interface UrineAnalysis {
  physical: {
    color: string;
    odor: string;
    density: number;
  };
  chemical: {
    pH: number;
    protein: string;
    glucose: string;
    ketone: string;
    bilirubin: string;
  };
  microscopic: {
    erythrocytes: string;
    leukocytes: string;
    crystals: string;
    epithelialCells: string;
    bacterialPresence: string;
  };
}

const mockHemogramResults = {
  RBC: { value: '5.5 x10^6/μL', referenceRange: '4.8-6.5 x10^6/μL', status: 'normal' as const },
  HGB: { value: '15.2 g/dL', referenceRange: '13.5-17.5 g/dL', status: 'normal' as const },
  WBC: { value: '8.4 x10^3/μL', referenceRange: '5.5-12.5 x10^3/μL', status: 'normal' as const },
  HCT: { value: '42%', referenceRange: '37-52%', status: 'normal' as const },
  PCV: { value: '42%', referenceRange: '37-52%', status: 'normal' as const },
  MCH: { value: '27.5 pg', referenceRange: '26-34 pg', status: 'normal' as const },
  MCHC: { value: '34.2 g/dL', referenceRange: '32-36 g/dL', status: 'normal' as const },
  PLT: { value: '250 x10^3/μL', referenceRange: '150-400 x10^3/μL', status: 'normal' as const },
  MPV: { value: '10.2 fL', referenceRange: '8.0-12.0 fL', status: 'normal' as const },
};

const mockUrineAnalysis = {
  physical: {
    color: { value: 'Sarı', referenceRange: 'Sarı-Amber' },
    odor: { value: 'Normal', referenceRange: '-' },
    density: { value: '1.020', referenceRange: '1.015-1.045' },
  },
  chemical: {
    pH: { value: '6.5', referenceRange: '6.0-7.5' },
    protein: { value: 'Negatif', referenceRange: 'Negatif' },
    glucose: { value: 'Negatif', referenceRange: 'Negatif' },
    ketone: { value: 'Negatif', referenceRange: 'Negatif' },
    bilirubin: { value: 'Negatif', referenceRange: 'Negatif' },
  },
  microscopic: {
    erythrocytes: { value: '0-1', referenceRange: '0-5/HPF' },
    leukocytes: { value: '2-3', referenceRange: '0-5/HPF' },
    crystals: { value: 'Yok', referenceRange: 'Yok' },
    epithelialCells: { value: 'Nadir', referenceRange: '0-1/HPF' },
    bacterialPresence: { value: 'Yok', referenceRange: 'Yok' },
  },
};

const mockBiochemistryResults = {
  ALT: { value: '45 U/L', referenceRange: '10-100 U/L', status: 'normal' as const },
  AST: { value: '50 U/L', referenceRange: '0-50 U/L', status: 'normal' as const },
  ALP: { value: '90 U/L', referenceRange: '20-150 U/L', status: 'normal' as const },
  GGT: { value: '7 U/L', referenceRange: '0-11 U/L', status: 'normal' as const },
  TBIL: { value: '0.3 mg/dL', referenceRange: '0.1-0.6 mg/dL', status: 'normal' as const },
  DBIL: { value: '0.1 mg/dL', referenceRange: '0-0.3 mg/dL', status: 'normal' as const },
  UREA: { value: '35 mg/dL', referenceRange: '20-50 mg/dL', status: 'normal' as const },
  CREATININE: { value: '1.2 mg/dL', referenceRange: '0.5-1.8 mg/dL', status: 'normal' as const },
  SDMA: { value: '12 μg/dL', referenceRange: '0-14 μg/dL', status: 'normal' as const },
  GLUCOSE: { value: '95 mg/dL', referenceRange: '70-150 mg/dL', status: 'normal' as const },
  LACTATE: { value: '2.1 mmol/L', referenceRange: '0.5-2.5 mmol/L', status: 'normal' as const },
  TRIGLYCERIDES: { value: '89 mg/dL', referenceRange: '20-150 mg/dL', status: 'normal' as const },
  TOTAL_PROTEIN: { value: '6.8 g/dL', referenceRange: '5.4-8.2 g/dL', status: 'normal' as const },
  ALBUMIN: { value: '3.5 g/dL', referenceRange: '2.3-4.0 g/dL', status: 'normal' as const },
  GLOBULIN: { value: '3.3 g/dL', referenceRange: '2.5-4.5 g/dL', status: 'normal' as const },
  NA: { value: '145 mEq/L', referenceRange: '135-155 mEq/L', status: 'normal' as const },
  K: { value: '4.2 mEq/L', referenceRange: '3.5-5.8 mEq/L', status: 'normal' as const },
  CL: { value: '110 mEq/L', referenceRange: '95-115 mEq/L', status: 'normal' as const },
  P: { value: '4.5 mg/dL', referenceRange: '2.5-6.8 mg/dL', status: 'normal' as const },
  MG: { value: '2.1 mg/dL', referenceRange: '1.5-2.5 mg/dL', status: 'normal' as const },
  AMYLASE: { value: '700 U/L', referenceRange: '200-1200 U/L', status: 'normal' as const },
  LIPASE: { value: '300 U/L', referenceRange: '100-500 U/L', status: 'normal' as const },
  TLI: { value: '25 μg/L', referenceRange: '5-35 μg/L', status: 'normal' as const },
  PLI: { value: '200 μg/L', referenceRange: '0-200 μg/L', status: 'normal' as const },
};

const mockStoolResults = {
  parasiteEggs: { value: 'Negatif', referenceRange: 'Negatif', status: 'normal' as const },
  parasiteLarvae: { value: 'Negatif', referenceRange: 'Negatif', status: 'normal' as const },
  protozoa: { value: 'Negatif', referenceRange: 'Negatif', status: 'normal' as const },
  flotation: { value: 'Negatif', referenceRange: 'Negatif', status: 'normal' as const },
  giardia: { value: 'Negatif', referenceRange: 'Negatif', status: 'normal' as const },
  rotavirus: { value: 'Negatif', referenceRange: 'Negatif', status: 'normal' as const },
  coronavirus: { value: 'Negatif', referenceRange: 'Negatif', status: 'normal' as const },
  eColi: { value: 'Negatif', referenceRange: 'Negatif', status: 'normal' as const },
  directSmear: { value: 'Normal flora', referenceRange: '-', status: 'normal' as const },
};

const mockSerologyResults = {
  ELISA: {
    FIV: { value: 'Negatif', referenceRange: 'Negatif', status: 'normal' as const },
    FeLV: { value: 'Negatif', referenceRange: 'Negatif', status: 'normal' as const },
  },
  IFAT: {
    toxoplasmosis: { value: '1:64', referenceRange: '<1:64', status: 'normal' as const },
    leishmaniasis: { value: 'Negatif', referenceRange: 'Negatif', status: 'normal' as const },
  },
  agglutination: {
    brucella: { value: 'Negatif', referenceRange: 'Negatif', status: 'normal' as const },
  },
  precipitation: {
    FIP: { value: 'Negatif', referenceRange: 'Negatif', status: 'normal' as const },
  },
};

const mockMicrobiologyResults = {
  macConkey: {
    growth: { value: 'Üreme yok', referenceRange: '-', status: 'normal' as const },
    identification: { value: '-', referenceRange: '-', status: 'normal' as const },
  },
  bloodAgar: {
    growth: { value: 'Normal flora', referenceRange: '-', status: 'normal' as const },
    identification: { value: 'Staphylococcus pseudintermedius', referenceRange: '-', status: 'normal' as const },
  },
};

const mockMolecularResults = {
  PCR: {
    parvovirus: { value: 'Negatif', referenceRange: 'Negatif', status: 'normal' as const },
    coronavirus: { value: 'Negatif', referenceRange: 'Negatif', status: 'normal' as const },
    distemper: { value: 'Negatif', referenceRange: 'Negatif', status: 'normal' as const },
  },
  'RT-PCR': {
    calicivirus: { value: 'Negatif', referenceRange: 'Negatif', status: 'normal' as const },
    influenza: { value: 'Negatif', referenceRange: 'Negatif', status: 'normal' as const },
  },
};

const mockCytologyResults = {
  bodyFluids: {
    type: 'Eklem sıvısı',
    findings: 'Normal sinovyal sıvı özellikleri',
    diagnosis: 'Patolojik bulgu yok',
    date: '2024-01-15',
  },
  aspirate: {
    type: 'Lenf nodu',
    findings: 'Normal lenfoid hücre popülasyonu',
    diagnosis: 'Reaktif hiperplazi',
    date: '2024-01-15',
  },
  effusion: {
    type: 'Plevral sıvı',
    findings: 'Berrak, açık sarı renkte',
    diagnosis: 'Transudat',
    date: '2024-01-15',
  },
};

const mockHistopathologyResults = {
  biopsy: {
    type: 'Deri biyopsisi',
    findings: 'Normal deri dokusu özellikleri',
    diagnosis: 'Patolojik bulgu yok',
    date: '2024-01-15',
  },
};

const mockHormoneResults = {
  T3: { value: '1.2 ng/mL', referenceRange: '0.5-1.5 ng/mL', status: 'normal' as const },
  T4: { value: '2.5 μg/dL', referenceRange: '1.0-4.0 μg/dL', status: 'normal' as const },
  TSH: { value: '0.4 ng/mL', referenceRange: '0.1-0.6 ng/mL', status: 'normal' as const },
  CORTISOL: { value: '2.5 μg/dL', referenceRange: '1.0-4.0 μg/dL', status: 'normal' as const },
  ESTRADIOL: { value: '25 pg/mL', referenceRange: '20-65 pg/mL', status: 'normal' as const },
  PROGESTERONE: { value: '0.5 ng/mL', referenceRange: '0.2-1.5 ng/mL', status: 'normal' as const },
};

const mockBiopsyResults = {
  incisional: {
    type: 'İnsizyonel biyopsi',
    location: 'Deri lezyonu',
    findings: 'Normal deri dokusu özellikleri',
    diagnosis: 'Patolojik bulgu yok',
    date: '2024-01-15',
  },
  excisional: {
    type: 'Eksizyonel biyopsi',
    location: 'Kutanöz kitle',
    findings: 'Benign neoplastik proliferasyon',
    diagnosis: 'Lipom',
    date: '2024-01-15',
  },
  fna: {
    type: 'İnce iğne aspirasyon biyopsisi',
    location: 'Lenf nodu',
    findings: 'Normal lenfoid hücre popülasyonu',
    diagnosis: 'Reaktif hiperplazi',
    date: '2024-01-15',
  },
  trucut: {
    type: 'Trukat biyopsi',
    location: 'Karaciğer',
    findings: 'Normal karaciğer dokusu',
    diagnosis: 'Patolojik bulgu yok',
    date: '2024-01-15',
  },
};

const LaboratoryTests: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | false>('hemogram');

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  const renderTestResult = (label: string, result: TestResult) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {label}:
      </Typography>
      <Box>
        <Typography
          variant="body2"
          component="span"
          className={result.status ? `${result.status}-value` : ''}
        >
          {result.value}
        </Typography>
        {result.referenceRange && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            ({result.referenceRange})
          </Typography>
        )}
      </Box>
    </Box>
  );

  const renderUrineAnalysis = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Fiziksel Analiz
        </Typography>
        {Object.entries(mockUrineAnalysis.physical).map(([key, result]) => (
          <Box key={key} className="test-result">
            {renderTestResult(
              key.charAt(0).toUpperCase() + key.slice(1),
              result as TestResult
            )}
          </Box>
        ))}
      </Box>
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Kimyasal Analiz
        </Typography>
        {Object.entries(mockUrineAnalysis.chemical).map(([key, result]) => (
          <Box key={key} className="test-result">
            {renderTestResult(
              key.charAt(0).toUpperCase() + key.slice(1),
              result as TestResult
            )}
          </Box>
        ))}
      </Box>
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Mikroskobik Analiz
        </Typography>
        {Object.entries(mockUrineAnalysis.microscopic).map(([key, result]) => (
          <Box key={key} className="test-result">
            {renderTestResult(
              key.charAt(0).toUpperCase() + key.slice(1),
              result as TestResult
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );

  const renderBiochemistryResults = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
      {Object.entries(mockBiochemistryResults).map(([key, result]) => (
        <Box key={key} className="test-result">
          {renderTestResult(key, result)}
        </Box>
      ))}
    </Box>
  );

  const renderStoolResults = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
      {Object.entries(mockStoolResults).map(([key, result]) => (
        <Box key={key} className="test-result">
          {renderTestResult(key, result)}
        </Box>
      ))}
    </Box>
  );

  const renderSerologyResults = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
      {Object.entries(mockSerologyResults).map(([category, tests]) => (
        <Box key={category}>
          <Typography variant="subtitle2" gutterBottom>
            {category}
          </Typography>
          {Object.entries(tests).map(([testName, result]) => (
            <Box key={testName} className="test-result">
              {renderTestResult(testName, result)}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );

  const renderMicrobiologyResults = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
      {Object.entries(mockMicrobiologyResults).map(([medium, results]) => (
        <Box key={medium}>
          <Typography variant="subtitle2" gutterBottom>
            {medium}
          </Typography>
          {Object.entries(results).map(([key, result]) => (
            <Box key={key} className="test-result">
              {renderTestResult(key, result)}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );

  const renderMolecularResults = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
      {Object.entries(mockMolecularResults).map(([method, tests]) => (
        <Box key={method}>
          <Typography variant="subtitle2" gutterBottom>
            {method}
          </Typography>
          {Object.entries(tests).map(([testName, result]) => (
            <Box key={testName} className="test-result">
              {renderTestResult(testName, result)}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );

  const renderCytologyHistopathologyResults = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Sitoloji
        </Typography>
        {Object.entries(mockCytologyResults).map(([key, result]) => (
          <Box key={key} className="test-card">
            <Typography variant="subtitle2" color="primary">
              {result.type}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Bulgular:</strong> {result.findings}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Tanı:</strong> {result.diagnosis}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Tarih: {result.date}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Histopatoloji
        </Typography>
        {Object.entries(mockHistopathologyResults).map(([key, result]) => (
          <Box key={key} className="test-card">
            <Typography variant="subtitle2" color="primary">
              {result.type}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Bulgular:</strong> {result.findings}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Tanı:</strong> {result.diagnosis}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Tarih: {result.date}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );

  const renderHormoneResults = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
      {Object.entries(mockHormoneResults).map(([key, result]) => (
        <Box key={key} className="test-result">
          {renderTestResult(key, result)}
        </Box>
      ))}
    </Box>
  );

  const renderBiopsyResults = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
      {Object.entries(mockBiopsyResults).map(([key, result]) => (
        <Box key={key} className="test-card">
          <Typography variant="subtitle2" color="primary">
            {result.type}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Lokasyon:</strong> {result.location}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Bulgular:</strong> {result.findings}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Tanı:</strong> {result.diagnosis}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Tarih: {result.date}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  const renderActionButtons = () => (
    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
      <Button
        variant="contained"
        startIcon={<PrintIcon />}
        sx={{ bgcolor: '#92A78C', '&:hover': { bgcolor: '#7C8F77' } }}
      >
        Tüm Raporu Yazdır
      </Button>
      <Button
        variant="contained"
        startIcon={<DownloadIcon />}
        sx={{ bgcolor: '#92A78C', '&:hover': { bgcolor: '#7C8F77' } }}
      >
        PDF Olarak İndir
      </Button>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ bgcolor: '#92A78C', '&:hover': { bgcolor: '#7C8F77' } }}
      >
        Yeni Test Ekle
      </Button>
    </Box>
  );

  return (
    <Box sx={{ p: 2 }} className="laboratory-tests">
      <Typography variant="h6" sx={{ mb: 2 }}>
        Laboratuvar Testleri
      </Typography>

      <Accordion
        expanded={expandedSection === 'hemogram'}
        onChange={handleChange('hemogram')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Hemogram Sonuçları</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            {Object.entries(mockHemogramResults).map(([key, result]) => (
              <Box key={key} className="test-result">
                {renderTestResult(key, result)}
              </Box>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expandedSection === 'biochemistry'}
        onChange={handleChange('biochemistry')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Biyokimya Sonuçları</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderBiochemistryResults()}
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expandedSection === 'urinalysis'}
        onChange={handleChange('urinalysis')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>İdrar Analizi</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderUrineAnalysis()}
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expandedSection === 'stool'}
        onChange={handleChange('stool')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Dışkı Analizleri</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderStoolResults()}
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expandedSection === 'serology'}
        onChange={handleChange('serology')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Serolojik Testler</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderSerologyResults()}
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expandedSection === 'microbiology'}
        onChange={handleChange('microbiology')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Mikrobiyolojik Kültür</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderMicrobiologyResults()}
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expandedSection === 'molecular'}
        onChange={handleChange('molecular')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Moleküler Tanı</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderMolecularResults()}
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expandedSection === 'cytology'}
        onChange={handleChange('cytology')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Sitoloji ve Histopatoloji</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderCytologyHistopathologyResults()}
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expandedSection === 'hormone'}
        onChange={handleChange('hormone')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Hormon Testleri</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderHormoneResults()}
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expandedSection === 'biopsy'}
        onChange={handleChange('biopsy')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Biyopsi Sonuçları</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderBiopsyResults()}
        </AccordionDetails>
      </Accordion>

      {renderActionButtons()}
    </Box>
  );
};

export default LaboratoryTests; 