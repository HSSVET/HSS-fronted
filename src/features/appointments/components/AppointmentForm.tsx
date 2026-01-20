import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
} from '@mui/material';
import { LegacyAppointment, AppointmentFormData } from '../types/appointment';

interface AppointmentFormProps {
    appointment: LegacyAppointment | null;
    selectedDate: Date;
    onSave: (formData: AppointmentFormData) => void;
    onCancel: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
    appointment,
    selectedDate,
    onSave,
    onCancel
}) => {
    const [formData, setFormData] = useState<AppointmentFormData>({
        time: '',
        patientName: '',
        patientId: '',
        phone: '',
        ownerName: '',
        chipNumber: '',
        breed: '',
        petType: '',
        description: ''
    });

    useEffect(() => {
        if (appointment) {
            setFormData({
                time: appointment.time || '',
                patientName: appointment.patientName || '',
                patientId: appointment.patientId || '',
                phone: appointment.phone || '',
                ownerName: appointment.ownerName || '',
                chipNumber: appointment.chipNumber || '',
                breed: appointment.breed || '',
                petType: appointment.petType || '',
                description: appointment.description || ''
            });
        }
    }, [appointment]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        onSave(formData);
    };

    const formatDate = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString('tr-TR', options);
    };

    return (
        <form onSubmit={handleSubmit}>
            <DialogTitle sx={{ pb: 1 }}>
                {appointment ? 'Randevu Düzenle' : 'Yeni Randevu Al'}
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {formatDate(selectedDate)}
                </Typography>
            </DialogTitle>

            <DialogContent dividers>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    {/* Time Selection */}
                    <TextField
                        type="time"
                        name="time"
                        label="Randevu Saati"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />

                    {/* Owner Information */}
                    <Box>
                        <Typography variant="subtitle2" gutterBottom color="primary">
                            Hasta Sahibi Bilgileri
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                            <TextField
                                name="ownerName"
                                label="Ad Soyad"
                                value={formData.ownerName}
                                onChange={handleInputChange}
                                required
                                fullWidth
                                size="small"
                            />
                            <TextField
                                name="phone"
                                label="Telefon"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                fullWidth
                                size="small"
                            />
                            <Box sx={{ gridColumn: { xs: '1', md: 'span 2' } }}>
                                <TextField
                                    name="patientId"
                                    label="TC Kimlik No"
                                    value={formData.patientId}
                                    onChange={handleInputChange}
                                    required
                                    fullWidth
                                    size="small"
                                    inputProps={{ maxLength: 11 }}
                                />
                            </Box>
                        </Box>
                    </Box>

                    {/* Patient Information */}
                    <Box>
                        <Typography variant="subtitle2" gutterBottom color="primary">
                            Hasta Bilgileri
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                            <TextField
                                name="patientName"
                                label="Hasta Adı"
                                value={formData.patientName}
                                onChange={handleInputChange}
                                required
                                fullWidth
                                size="small"
                            />
                            <TextField
                                name="chipNumber"
                                label="Çip No"
                                value={formData.chipNumber}
                                onChange={handleInputChange}
                                fullWidth
                                size="small"
                            />
                            <TextField
                                name="petType"
                                label="Tür"
                                value={formData.petType}
                                onChange={handleInputChange}
                                fullWidth
                                size="small"
                            />
                            <TextField
                                name="breed"
                                label="Irk"
                                value={formData.breed}
                                onChange={handleInputChange}
                                fullWidth
                                size="small"
                            />
                        </Box>
                    </Box>

                    {/* Description */}
                    <TextField
                        name="description"
                        label="Açıklama / Notlar"
                        value={formData.description}
                        onChange={handleInputChange}
                        multiline
                        rows={3}
                        fullWidth
                    />
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2.5 }}>
                <Button onClick={onCancel} color="inherit">
                    İptal
                </Button>
                <Button type="submit" variant="contained">
                    {appointment ? 'Güncelle' : 'Kaydet'}
                </Button>
            </DialogActions>
        </form>
    );
};

export default AppointmentForm; 