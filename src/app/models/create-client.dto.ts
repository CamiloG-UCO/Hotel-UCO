export interface CreateClientDto {
  documentType: 'CC' | 'CE' | 'TI' | 'NIT';
  documentNumber: string;
  name: string;
  lastNames: string;
  email: string;
  phone: string;
}
