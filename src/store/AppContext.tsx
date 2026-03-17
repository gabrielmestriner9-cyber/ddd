import React, { createContext, useContext, useState } from 'react';
import type { Patient, Appointment, Payment, NavPage } from '../types';
import { patients as initialPatients, appointments as initialAppointments, payments as initialPayments } from '../data/mockData';

interface AppContextType {
  patients: Patient[];
  appointments: Appointment[];
  payments: Payment[];
  currentPage: NavPage;
  setCurrentPage: (page: NavPage) => void;
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (appointment: Appointment) => void;
  addPayment: (payment: Payment) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [currentPage, setCurrentPage] = useState<NavPage>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const addPatient = (patient: Patient) => {
    setPatients(prev => [patient, ...prev]);
  };

  const updatePatient = (patient: Patient) => {
    setPatients(prev => prev.map(p => p.id === patient.id ? patient : p));
  };

  const addAppointment = (appointment: Appointment) => {
    setAppointments(prev => [appointment, ...prev]);
  };

  const updateAppointment = (appointment: Appointment) => {
    setAppointments(prev => prev.map(a => a.id === appointment.id ? appointment : a));
  };

  const addPayment = (payment: Payment) => {
    setPayments(prev => [payment, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      patients, appointments, payments,
      currentPage, setCurrentPage,
      selectedPatientId, setSelectedPatientId,
      addPatient, updatePatient,
      addAppointment, updateAppointment,
      addPayment,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
