import { useState } from 'react';
import { format, parseISO, subDays, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Save,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import type { Appointment, AppointmentStatus, ServiceType, PaymentMethod } from '../types';
import { serviceLabels, services as allServices } from '../data/mockData';

const statusColors: Record<AppointmentStatus, string> = {
  agendado: 'bg-blue-100 text-blue-700 border-blue-200',
  confirmado: 'bg-green-100 text-green-700 border-green-200',
  concluido: 'bg-gray-100 text-gray-600 border-gray-200',
  cancelado: 'bg-red-100 text-red-600 border-red-200',
  falta: 'bg-orange-100 text-orange-700 border-orange-200',
};

const statusLabels: Record<AppointmentStatus, string> = {
  agendado: 'Agendado',
  confirmado: 'Confirmado',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
  falta: 'Falta',
};

const serviceTypeColors: Record<string, string> = {
  fisioterapia: '#1a5aa0',
  pilates: '#78bc1f',
  pilates_kids: '#f59e0b',
  liberacao_miofascial: '#8b5cf6',
  ventosaterapia: '#ef4444',
  reabilitacao: '#06b6d4',
};

function AppointmentForm({ onClose, defaultDate }: { onClose: () => void; defaultDate: string }) {
  const { patients, addAppointment } = useApp();
  const [form, setForm] = useState({
    patientId: '',
    serviceType: 'pilates' as ServiceType,
    date: defaultDate,
    startTime: '08:00',
    notes: '',
    value: 100,
    paymentMethod: 'pix' as PaymentMethod,
    paymentStatus: 'pendente' as 'pago' | 'pendente',
  });

  const selectedService = allServices.find(s => s.type === form.serviceType);

  const getEndTime = (start: string, duration: number) => {
    const [h, m] = start.split(':').map(Number);
    const total = h * 60 + m + duration;
    return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientId) return;
    const patient = patients.find(p => p.id === form.patientId)!;
    const service = allServices.find(s => s.type === form.serviceType)!;
    const endTime = getEndTime(form.startTime, service.duration);

    const newApt: Appointment = {
      id: `apt${Date.now()}`,
      patientId: form.patientId,
      patientName: patient.name,
      professionalId: 'p1',
      professionalName: 'Ketty Marcon Gianotti',
      serviceType: form.serviceType,
      serviceName: service.name,
      date: form.date,
      startTime: form.startTime,
      endTime,
      status: 'agendado',
      notes: form.notes || undefined,
      paymentStatus: form.paymentStatus,
      paymentMethod: form.paymentStatus === 'pago' ? form.paymentMethod : undefined,
      value: form.value,
    };
    addAppointment(newApt);

    // Update patient totalSessions
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Novo Agendamento</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Paciente *</label>
            <select required className="input" value={form.patientId}
              onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))}>
              <option value="">Selecionar paciente...</option>
              {patients.filter(p => p.status !== 'inativo').map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Serviço *</label>
            <select className="input" value={form.serviceType}
              onChange={e => {
                const svc = allServices.find(s => s.type === e.target.value);
                setForm(f => ({
                  ...f,
                  serviceType: e.target.value as ServiceType,
                  value: svc?.price || f.value,
                }));
              }}>
              {allServices.map(s => (
                <option key={s.id} value={s.type}>{s.name} — {s.duration}min</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Data *</label>
              <input type="date" required className="input" value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <label className="label">Horário *</label>
              <input type="time" required className="input" value={form.startTime}
                onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
            </div>
          </div>

          {selectedService && (
            <div className="flex items-center gap-2 p-3 bg-primary-50 rounded-lg text-sm text-primary-700">
              <Clock size={14} />
              <span>Duração: {selectedService.duration} min · Término: {getEndTime(form.startTime, selectedService.duration)}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Valor (R$)</label>
              <input type="number" className="input" min={0} step={0.01} value={form.value}
                onChange={e => setForm(f => ({ ...f, value: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div>
              <label className="label">Pagamento</label>
              <select className="input" value={form.paymentStatus}
                onChange={e => setForm(f => ({ ...f, paymentStatus: e.target.value as 'pago' | 'pendente' }))}>
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
              </select>
            </div>
          </div>

          {form.paymentStatus === 'pago' && (
            <div>
              <label className="label">Forma de pagamento</label>
              <select className="input" value={form.paymentMethod}
                onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value as PaymentMethod }))}>
                <option value="pix">PIX</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="cartao_credito">Cartão de crédito</option>
                <option value="cartao_debito">Cartão de débito</option>
                <option value="convenio">Convênio</option>
              </select>
            </div>
          )}

          <div>
            <label className="label">Observações</label>
            <textarea className="input min-h-[70px] resize-y" value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 btn-ghost border border-gray-300">
              Cancelar
            </button>
            <button type="submit" className="flex-1 btn-primary flex items-center justify-center gap-2">
              <Save size={16} /> Agendar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatusMenu({ appointment, onUpdate }: {
  appointment: Appointment;
  onUpdate: (apt: Appointment) => void;
}) {
  const [open, setOpen] = useState(false);
  const statuses: AppointmentStatus[] = ['agendado', 'confirmado', 'concluido', 'cancelado', 'falta'];

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusColors[appointment.status]}`}
      >
        {statusLabels[appointment.status]}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 w-36">
          {statuses.map(s => (
            <button
              key={s}
              onClick={(e) => {
                e.stopPropagation();
                onUpdate({ ...appointment, status: s });
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2 ${
                appointment.status === s ? 'font-semibold' : ''
              }`}
            >
              {s === 'concluido' && <CheckCircle size={12} className="text-green-500" />}
              {s === 'cancelado' && <XCircle size={12} className="text-red-500" />}
              {s === 'falta' && <AlertCircle size={12} className="text-orange-500" />}
              {(s === 'agendado' || s === 'confirmado') && <Clock size={12} className="text-blue-500" />}
              {statusLabels[s]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Appointments() {
  const { appointments, updateAppointment } = useApp();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const dayAppointments = appointments
    .filter(a => {
      const matchDate = a.date === selectedDate;
      const matchStatus = statusFilter === 'todos' || a.status === statusFilter;
      return matchDate && matchStatus;
    })
    .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));

  const totalValue = dayAppointments.reduce((s, a) => s + a.value, 0);
  const paidValue = dayAppointments
    .filter(a => a.paymentStatus === 'pago')
    .reduce((s, a) => s + a.value, 0);

  return (
    <div className="space-y-4">
      {showForm && <AppointmentForm onClose={() => setShowForm(false)} defaultDate={selectedDate} />}

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDate(format(subDays(parseISO(selectedDate), 1), 'yyyy-MM-dd'))}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <ChevronLeft size={18} />
          </button>
          <input
            type="date"
            className="input w-auto text-sm font-medium"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          />
          <button
            onClick={() => setSelectedDate(format(addDays(parseISO(selectedDate), 1), 'yyyy-MM-dd'))}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={() => setSelectedDate(format(new Date(), 'yyyy-MM-dd'))}
            className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
          >
            Hoje
          </button>
        </div>

        <div className="flex gap-2">
          <select
            className="text-sm border border-gray-300 rounded-lg px-2 py-2 focus:outline-none"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="todos">Todos status</option>
            <option value="agendado">Agendado</option>
            <option value="confirmado">Confirmado</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
            <option value="falta">Falta</option>
          </select>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Agendar
          </button>
        </div>
      </div>

      {/* Date header */}
      <div className="card py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-800 capitalize">
              {format(parseISO(selectedDate), "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </h2>
            <p className="text-sm text-gray-500">{dayAppointments.length} atendimento(s)</p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-right">
              <p className="font-bold text-gray-800">R$ {paidValue.toFixed(2).replace('.', ',')}</p>
              <p className="text-xs text-gray-400">recebido</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-orange-600">R$ {(totalValue - paidValue).toFixed(2).replace('.', ',')}</p>
              <p className="text-xs text-gray-400">pendente</p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments list */}
      {dayAppointments.length === 0 ? (
        <div className="card text-center py-16">
          <Clock size={48} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-500 font-medium">Nenhum agendamento</p>
          <p className="text-gray-400 text-sm mt-1">para este dia</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mt-4 mx-auto flex items-center gap-2">
            <Plus size={16} /> Adicionar agendamento
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {dayAppointments.map(apt => (
            <div key={apt.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                {/* Time */}
                <div className="text-center w-14 flex-shrink-0">
                  <p className="text-sm font-bold text-gray-700">{apt.startTime}</p>
                  <p className="text-xs text-gray-400">{apt.endTime}</p>
                </div>

                {/* Color bar */}
                <div
                  className="w-1 h-12 rounded-full flex-shrink-0"
                  style={{ backgroundColor: serviceTypeColors[apt.serviceType] || '#6b7280' }}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-gray-800">{apt.patientName}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-0.5">
                    <span
                      className="px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: serviceTypeColors[apt.serviceType] + '20',
                        color: serviceTypeColors[apt.serviceType],
                      }}
                    >
                      {serviceLabels[apt.serviceType]}
                    </span>
                    {apt.notes && <span className="italic">{apt.notes}</span>}
                  </div>
                </div>

                {/* Status + payment */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-shrink-0">
                  <StatusMenu appointment={apt} onUpdate={updateAppointment} />
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-700">
                      R$ {apt.value.toFixed(2).replace('.', ',')}
                    </p>
                    <p className={`text-xs font-medium ${apt.paymentStatus === 'pago' ? 'text-green-600' : 'text-orange-500'}`}>
                      {apt.paymentStatus === 'pago' ? '✓ Pago' : 'Pendente'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
