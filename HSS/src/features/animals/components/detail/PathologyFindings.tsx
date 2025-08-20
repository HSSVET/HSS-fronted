import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface ReportInfo {
  reportNo: string;
  date: string;
  pathologist: string;
  sampleNo: string;
}

interface SampleInfo {
  sampleType: string;
  location: string;
}

interface PathologyFindingsProps {
  reportInfo: ReportInfo;
  sampleInfo: SampleInfo;
}

const PathologyFindings: React.FC<PathologyFindingsProps> = ({
  reportInfo,
  sampleInfo,
}) => {
  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      {/* Report Header */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
              RAPOR BİLGİLERİ
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ fontWeight: 'bold', minWidth: 120 }}>
                  RAPOR NO:
                </Typography>
                <Typography>{reportInfo.reportNo}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ fontWeight: 'bold', minWidth: 120 }}>
                  TARİH:
                </Typography>
                <Typography>{reportInfo.date}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ fontWeight: 'bold', minWidth: 120 }}>
                  PATOLOJİ UZMAN HEKİM:
                </Typography>
                <Typography>{reportInfo.pathologist}</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
              ÖRNEK BİLGİLERİ
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ fontWeight: 'bold', minWidth: 120 }}>
                  ÖRNEK TİPİ:
                </Typography>
                <Typography>{sampleInfo.sampleType}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ fontWeight: 'bold', minWidth: 120 }}>
                  ALINDIĞI YER:
                </Typography>
                <Typography>{sampleInfo.location}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ fontWeight: 'bold', minWidth: 120 }}>
                  ÖRNEK NUMARASI:
                </Typography>
                <Typography>{reportInfo.sampleNo}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Microscopic Findings */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">MİKROSKOBİK BULGULAR</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                1. DOKU BÜTÜNLÜĞÜ VE HİSTOLOJİK YAPI
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Typography>• Doku düzeni</Typography>
                <Typography>• Epitel hücrelerin yapısı ve dizilişi</Typography>
                <Typography>• Organın tabakaları</Typography>
              </Box>
            </Box>
            <Divider />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                2. HÜCRESEL DEĞİŞİKLİKLER
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Typography>• Nekroz</Typography>
                <Typography>• Apoptoz</Typography>
                <Typography>• Dejenerasyon</Typography>
                <Typography>• Hiperplazi/hipertrofi/atrofi</Typography>
              </Box>
            </Box>
            <Divider />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                3. İNFLAMATUAR YANITIN DEĞERLENDİRİLMESİ
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Typography>• Akut/kronik</Typography>
                <Typography>• Yayılım</Typography>
                <Typography>• İçerik</Typography>
                <Typography>• Granülom varlığı</Typography>
                <Typography>• Yangının şiddeti</Typography>
              </Box>
            </Box>
            <Divider />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                4. ETKENLERİN SAPTANMASI
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Typography>• Bakteri, virüs, mantar, parazit varlığı</Typography>
                <Typography>• Giemsa, Ziehl-Neelsen, PAS boyama</Typography>
                <Typography>• İmmunohistokimyasal boyalar</Typography>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Macroscopic and Microscopic Findings */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">MAKROSKOBİK VE MİKROSKOBİK BULGULAR</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                1. NEOPLAZİNİN DEĞERLENDİRİLMESİ
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Typography>• Tümör tipi</Typography>
                <Typography>• Malignite</Typography>
                <Typography>• Metastaz durumu</Typography>
                <Typography>• İmmunohistokimyasal profil</Typography>
              </Box>
            </Box>
            <Divider />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                2. VASKÜLER VE BAĞ DOKUSU DEĞİŞİKLİKLERİ
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Typography>• Hemorajiler</Typography>
                <Typography>• Tromboz veya emboli</Typography>
                <Typography>• Fibrozis</Typography>
                <Typography>• Ödem varlığı</Typography>
                <Typography>• Skar dokusu oluşumu</Typography>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Necropsy Findings */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">NEKROPSİ BULGULARI</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Add all necropsy sections here */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                1. GENEL DURUM KRİTERLERİ
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Typography>• VÜCUT KONDİSYONU</Typography>
                <Typography>• HİDRATASYON DURUMU</Typography>
                <Typography>• ÖLÜM ŞEKLİ</Typography>
                <Typography>• KADAVRA DURUMU</Typography>
              </Box>
            </Box>
            <Divider />
            {/* Add other necropsy sections similarly */}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Conclusion */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">SONUÇ</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Genel sonuç değerlendirme</Typography>
        </AccordionDetails>
      </Accordion>

      {/* Pathologist Information */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
          PATOLOJİ UZMAN HEKİM BİLGİLERİ
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: 120 }}>
              AD SOYAD:
            </Typography>
            <Typography>Dr. {reportInfo.pathologist}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: 120 }}>
              KLİNİK/FAKÜLTE/KURUM:
            </Typography>
            <Typography>Veteriner Patoloji Laboratuvarı</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: 120 }}>
              İMZA:
            </Typography>
            <Box
              sx={{
                width: 200,
                height: 60,
                border: '1px dashed #ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography color="text.secondary">İmza alanı</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default PathologyFindings; 