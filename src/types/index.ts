export type ServiceType = 'fisioterapia' | 'pilates' | 'pilates_kids' | 'liberacao_miofascial' | 'ventosaterapia' | 'reabilitacao';

export type Gender = 'masculino' | 'feminino' | 'outro';

export type PatientStatus = 'ativo' | 'inativo' | 'aguardando';

export type AppointmentStatus = 'agendado' | 'confirmado' | 'concluido' | 'cancelado' | 'falta';

export type PaymentStatus = 'pago' | 'pendente' | 'parcial';

export type PaymentMethod = 'dinheiro' | 'pix' | 'cartao_credito' | 'cartao_debito' | 'convenio';

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface MedicalHistory {
  mainComplaint: string;
  diagnosis?: string;
  medications?: string;
  allergies?: string;
  previousSurgeries?: string;
  chronicConditions?: string;
  observations?: string;
}

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
  gender: Gender;
  phone: string;
  whatsapp?: string;
  email?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
  medicalHistory?: MedicalHistory;
  services: ServiceType[];
  status: PatientStatus;
  registrationDate: string;
  lastVisit?: string;
  totalSessions: number;
  notes?: string;
  avatar?: string;
}

export interface Service {
  id: string;
  name: string;
  type: ServiceType;
  description: string;
  duration: number; // minutes
  price: number;
  color: string;
}

export interface Professional {
  id: string;
  name: string;
  register: string; // CREFITO
  specialties: ServiceType[];
  phone: string;
  email: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  professionalId: string;
  professionalName: string;
  serviceType: ServiceType;
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  value: number;
}

export interface Payment {
  id: string;
  patientId: string;
  patientName: string;
  appointmentId?: string;
  date: string;
  value: number;
  method: PaymentMethod;
  status: PaymentStatus;
  description: string;
  receipt?: string;
}

export interface MonthlyStats {
  month: string;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  revenue: number;
  newPatients: number;
}

export type NavPage = 'dashboard' | 'patients' | 'appointments' | 'services' | 'financial' | 'reports';
