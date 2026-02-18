export class VaccineCardService {
  async downloadVaccineCard(animalId: number): Promise<void> {
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8090'}/api/vaccinations/animal/${animalId}/vaccine-card`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to download vaccine card');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `asi-karnesi-${animalId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading vaccine card:', error);
      throw error;
    }
  }

  getVaccineCardUrl(animalId: number): string {
    return `/api/vaccinations/animal/${animalId}/vaccine-card`;
  }
}

export const vaccineCardService = new VaccineCardService();
export default vaccineCardService;
