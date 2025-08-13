import React, { useMemo, useState } from 'react';
import { Box, Button, Card, CardContent, MenuItem, TextField, Typography, Alert, Divider, Stack } from '@mui/material';
import { SmsService, type SmsProvider, type SmsResponseDto } from '../../../services/smsService';

const providerOptions: { label: string; value: SmsProvider }[] = [
    { label: 'Otomatik', value: 'AUTO' },
    { label: 'Twilio', value: 'TWILIO' },
    { label: 'NetGSM', value: 'NETGSM' },
];

const SmsPage: React.FC = () => {
    const [to, setTo] = useState('');
    const [message, setMessage] = useState('');
    const [provider, setProvider] = useState<SmsProvider>('AUTO');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<SmsResponseDto | null>(null);
    const [error, setError] = useState<string | null>(null);

    const isSendDisabled = useMemo(() => !to || !message || loading, [to, message, loading]);

    const handleSend = async () => {
        setLoading(true);
        setError(null);
        setResponse(null);
        try {
            const res = await SmsService.sendSms({ to, message, provider });
            setResponse(res);
        } catch (e: any) {
            setError(e?.message || 'Gönderim sırasında bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const [health, setHealth] = useState<any | null>(null);
    const [checkingHealth, setCheckingHealth] = useState(false);
    const checkHealth = async () => {
        setCheckingHealth(true);
        try {
            const res = await SmsService.health();
            setHealth(res);
        } catch (e) {
            setHealth({ smsServiceHealthy: false });
        } finally {
            setCheckingHealth(false);
        }
    };

    const [testPhone, setTestPhone] = useState('');
    const [testProvider, setTestProvider] = useState<'twilio' | 'netgsm'>('twilio');
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<any | null>(null);
    const runProviderTest = async () => {
        setTesting(true);
        setTestResult(null);
        try {
            const res = await SmsService.testProvider(testProvider, testPhone);
            setTestResult(res);
        } catch (e: any) {
            setTestResult({ success: false, error: e?.message });
        } finally {
            setTesting(false);
        }
    };

    return (
        <Box p={2}>
            <Typography variant="h5" gutterBottom>
                SMS Gönderimi
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' }, gap: 2 }}>
                <Card>
                    <CardContent>
                        <Stack spacing={2}>
                            <TextField
                                label="Telefon Numarası (+90...)"
                                fullWidth
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                            />
                            <TextField
                                select
                                label="Sağlayıcı"
                                fullWidth
                                value={provider}
                                onChange={(e) => setProvider(e.target.value as SmsProvider)}
                            >
                                {providerOptions.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Mesaj"
                                fullWidth
                                multiline
                                minRows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <Box>
                                <Button variant="contained" onClick={handleSend} disabled={isSendDisabled}>
                                    {loading ? 'Gönderiliyor...' : 'Gönder'}
                                </Button>
                            </Box>
                            {error && <Alert severity="error">{error}</Alert>}
                            {response && (
                                <Alert severity={response.success ? 'success' : 'warning'}>
                                    {response.success ? 'SMS gönderildi' : 'Gönderim başarısız'} | Sağlayıcı: {response.provider} | Durum: {response.status}
                                </Alert>
                            )}
                        </Stack>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h6">Servis Sağlığı</Typography>
                        <Button size="small" sx={{ mt: 1 }} variant="outlined" onClick={checkHealth} disabled={checkingHealth}>
                            {checkingHealth ? 'Kontrol ediliyor...' : 'Kontrol Et'}
                        </Button>
                        {health && (
                            <Box mt={2}>
                                <Alert severity={health.smsServiceHealthy ? 'success' : 'error'}>
                                    SMS Servisi: {health.smsServiceHealthy ? 'Sağlıklı' : 'Sorun var'}
                                </Alert>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Sağlayıcılar: {Array.isArray(health.availableProviders) ? health.availableProviders.join(', ') : '-'}
                                </Typography>
                            </Box>
                        )}
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6">Sağlayıcı Testi</Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1 }}>
                            <TextField
                                select
                                label="Sağlayıcı"
                                fullWidth
                                size="small"
                                value={testProvider}
                                onChange={(e) => setTestProvider(e.target.value as 'twilio' | 'netgsm')}
                            >
                                <MenuItem value="twilio">Twilio</MenuItem>
                                <MenuItem value="netgsm">NetGSM</MenuItem>
                            </TextField>
                            <TextField
                                label="Test Telefonu"
                                fullWidth
                                size="small"
                                value={testPhone}
                                onChange={(e) => setTestPhone(e.target.value)}
                            />
                        </Box>
                        <Button sx={{ mt: 1 }} size="small" variant="outlined" onClick={runProviderTest} disabled={testing || !testPhone}>
                            {testing ? 'Test ediliyor...' : 'Test Gönder'}
                        </Button>
                        {testResult && (
                            <Box mt={2}>
                                <Alert severity={testResult.success ? 'success' : 'warning'}>
                                    Sağlayıcı test sonucu: {testResult.success ? 'Başarılı' : 'Başarısız'}
                                </Alert>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default SmsPage;


