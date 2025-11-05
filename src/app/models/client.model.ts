export interface Client {
    id?: string;
    name: string; // obligatorio
    lastNames?: string;
    documentType?: string;
    documentNumber?: string;
    email?: string;
    phone?: string;
  }