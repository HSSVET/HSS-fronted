import { getAuth } from 'firebase/auth';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8090';
const API_URL = `${API_BASE_URL}/api/clinics`;

export interface Clinic {
  clinicId: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  licenseKey: string;
  licenseType: string;
  licenseStatus: string;
  slug: string;
}

export interface ClinicCreateRequest {
  name: string;
  address?: string;
  phone?: string;
  email?: string;

  licenseType?: string;
  adminEmail?: string;
  adminFirstName?: string;
  adminLastName?: string;
}

const getHeaders = async () => {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const getClinics = async (): Promise<any> => {
  try {
    const headers = await getHeaders();
    console.log('🔄 Fetching clinics from:', `${API_URL}?size=100`);
    const response = await fetch(`${API_URL}?size=100`, { headers });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Clinic API error:', response.status, errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ Clinics data:', data);
    return data;
  } catch (error) {
    console.error('❌ getClinics error:', error);
    throw error;
  }
};

export const createClinic = async (clinic: ClinicCreateRequest): Promise<Clinic> => {
  const headers = await getHeaders();
  const response = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(clinic)
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create clinic: ${error}`);
  }
  return response.json();
};

export const deleteClinic = async (id: number): Promise<void> => {
  const headers = await getHeaders();
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers
  });
  if (!response.ok) throw new Error('Failed to delete clinic');
};
