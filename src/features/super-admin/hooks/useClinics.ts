import { useState, useEffect, useMemo } from 'react';
import { getClinics, createClinic, deleteClinic, Clinic, ClinicCreateRequest } from '../services/clinicService';

export const useClinics = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [planFilter, setPlanFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const [formData, setFormData] = useState<ClinicCreateRequest>({
    name: '',
    address: '',
    phone: '',
    email: '',
    licenseType: 'STRT',
    adminEmail: '',
    adminFirstName: '',
    adminLastName: '',
    adminPassword: '',
    slug: ''
  });

  const fetchClinicsList = async () => {
    try {
      const data = await getClinics();
      setClinics(data.content || []);
    } catch (error) {
      console.error('Failed to fetch clinics:', error);
    }
  };

  useEffect(() => {
    fetchClinicsList();
  }, []);

  const handleCreateClinic = async () => {
    setLoading(true);
    try {
      await createClinic(formData);
      setModalOpen(false);
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        licenseType: 'STRT',
        adminEmail: '',
        adminFirstName: '',
        adminLastName: '',
        adminPassword: '',
        slug: ''
      });
      await fetchClinicsList();
    } catch (error) {
      console.error(error);
      alert('Error creating clinic');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClinic = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this clinic and all its tenant data?')) return;
    try {
      await deleteClinic(id);
      await fetchClinicsList();
    } catch (error) {
      console.error(error);
      alert('Error deleting clinic');
    }
  };

  const filteredClinics = useMemo(() => {
    return clinics.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' ? true : c.licenseStatus === statusFilter;
      const matchesPlan = planFilter === 'ALL' ? true :
        (planFilter === 'NONE' ? (!c.licenseType || c.licenseType === 'NONE') : c.licenseType === planFilter);
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [clinics, searchQuery, statusFilter, planFilter]);

  return {
    clinics,
    filteredClinics,
    loading,
    modalOpen,
    searchQuery,
    statusFilter,
    planFilter,
    viewMode,
    formData,
    setModalOpen,
    setSearchQuery,
    setStatusFilter,
    setPlanFilter,
    setViewMode,
    setFormData,
    handleCreateClinic,
    handleDeleteClinic,
    refreshClinics: fetchClinicsList
  };
};
