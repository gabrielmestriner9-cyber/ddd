import { useState } from 'react';
import { format, parseISO, differenceInYears } from 'date-fns';
import {
  Search,
  Plus,
  User,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  X,
  Save,
  ArrowLeft,
  Filter,
  Activity,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import type { Patient, ServiceType, Gender, PatientStatus } from '../types';
import { serviceLabels } from '../data/mockData';

const serviceColors: Record<string, string> = {
  fisioterapia: 'bg-primary-100 text-primary-700',
  pilates: 'bg-accent-100 text-accent-700',
  pilates_kids: 'bg-yellow-100 text-yellow-700',
  liberacao_miofascial: 'bg-purple-100 text-purple-700',
  ventosaterapia: 'bg-red-100 text-red-700',
  reabilitacao: 'bg-cyan-100 text-cyan-700',
};

const allServices: ServiceType[] = [
  'fisioterapia', 'pilates', 'pilates_kids',
  'liberacao_miofascial', 'ventosaterapia', 'reabilitacao',
];

function StatusBadge({ status }: { status: PatientStatus }) {
  const map = {
    ativo: 'badge-active',
    inativo: 'badge-inactive',
    aguardando: 'badge-pending',
  };
  const labels = { ativo: 'Ativo', inativo: 'Inativo', aguardando: 'Aguardando' };
  return <span className={map[status]}>{labels[status]}</span>;
}

// ---- Patient Detail ----
function PatientDetail({ patient, onBack }: { patient: Patient; onBack: () => void }) {
  const { appointments } = useApp();
  const patientAppointments = appointments
    .filter(a => a.patientId === patient.id)
    .sort((a, b) => `${b.date}${b.startTime}`.localeCompare(`${a.date}${a.startTime}`));

  const age = differenceInYears(new Date(), parseISO(patient.birthDate));

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm font-medium">
        <ArrowLeft size={16} /> Voltar para lista
      </button>

      {/* Header card */}
      <div className="card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-700 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {patient.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-gray-800">{patient.name}</h2>
              <StatusBadge status={patient.status} />
            </div>
            <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-500">
              <span>{age} anos · {patient.gender === 'feminino' ? 'Feminino' : patient.gender === 'masculino' ? 'Masculino' : 'Outro'}</span>
              {patient.phone && <span className="flex items-center gap-1"><Phone size={13} />{patient.phone}</span>}
              {patient.email && <span className="flex items-center gap-1"><Mail size={13} />{patient.email}</span>}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {patient.services.map(s => (
                <span key={s} className={`text-xs px-2 py-0.5 rounded-full ${serviceColors[s]}`}>{serviceLabels[s]}</span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-700">{patient.totalSessions}</p>
            <p className="text-xs text-gray-500">sessões totais</p>
            {patient.lastVisit && (
              <p className="text-xs text-gray-400 mt-1">
                Última visita: {format(parseISO(patient.lastVisit), 'dd/MM/yyyy')}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Medical History */}
        {patient.medicalHistory && (
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Activity size={16} className="text-primary-600" /> Histórico Clínico
            </h3>
            <div className="space-y-2 text-sm">
              {patient.medicalHistory.mainComplaint && (
                <div><span className="font-medium text-gray-600">Queixa principal:</span> <span className="text-gray-800">{patient.medicalHistory.mainComplaint}</span></div>
              )}
              {patient.medicalHistory.diagnosis && (
                <div><span className="font-medium text-gray-600">Diagnóstico:</span> <span className="text-gray-800">{patient.medicalHistory.diagnosis}</span></div>
              )}
              {patient.medicalHistory.medications && (
                <div><span className="font-medium text-gray-600">Medicamentos:</span> <span className="text-gray-800">{patient.medicalHistory.medications}</span></div>
              )}
              {patient.medicalHistory.allergies && (
                <div><span className="font-medium text-gray-600">Alergias:</span> <span className="text-gray-800">{patient.medicalHistory.allergies}</span></div>
              )}
              {patient.medicalHistory.chronicConditions && (
                <div><span className="font-medium text-gray-600">Condições crônicas:</span> <span className="text-gray-800">{patient.medicalHistory.chronicConditions}</span></div>
              )}
              {patient.medicalHistory.previousSurgeries && (
                <div><span className="font-medium text-gray-600">Cirurgias anteriores:</span> <span className="text-gray-800">{patient.medicalHistory.previousSurgeries}</span></div>
              )}
              {patient.medicalHistory.observations && (
                <div><span className="font-medium text-gray-600">Observações:</span> <span className="text-gray-800">{patient.medicalHistory.observations}</span></div>
              )}
            </div>
          </div>
        )}

        {/* Personal Info */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <User size={16} className="text-primary-600" /> Dados Pessoais
          </h3>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium text-gray-600">CPF:</span> <span className="text-gray-800">{patient.cpf}</span></div>
            <div><span className="font-medium text-gray-600">Data de nascimento:</span> <span className="text-gray-800">{format(parseISO(patient.birthDate), 'dd/MM/yyyy')}</span></div>
            {patient.whatsapp && <div><span className="font-medium text-gray-600">WhatsApp:</span> <span className="text-gray-800">{patient.whatsapp}</span></div>}
            {patient.address && (
              <div>
                <span className="font-medium text-gray-600">Endereço:</span>
                <span className="text-gray-800"> {patient.address.street}, {patient.address.number} - {patient.address.neighborhood}, {patient.address.city}/{patient.address.state}</span>
              </div>
            )}
            <div><span className="font-medium text-gray-600">Cadastro:</span> <span className="text-gray-800">{format(parseISO(patient.registrationDate), 'dd/MM/yyyy')}</span></div>
            {patient.notes && <div><span className="font-medium text-gray-600">Notas:</span> <span className="text-gray-800">{patient.notes}</span></div>}
          </div>
        </div>
      </div>

      {/* Appointment history */}
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Calendar size={16} className="text-primary-600" /> Histórico de Atendimentos
        </h3>
        {patientAppointments.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">Nenhum atendimento registrado</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 pr-4 text-gray-500 font-medium">Data</th>
                  <th className="text-left py-2 pr-4 text-gray-500 font-medium">Serviço</th>
                  <th className="text-left py-2 pr-4 text-gray-500 font-medium">Horário</th>
                  <th className="text-left py-2 pr-4 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Pagamento</th>
                </tr>
              </thead>
              <tbody>
                {patientAppointments.slice(0, 10).map(apt => (
                  <tr key={apt.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 pr-4 text-gray-700">{format(parseISO(apt.date), 'dd/MM/yyyy')}</td>
                    <td className="py-2 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${serviceColors[apt.serviceType]}`}>
                        {serviceLabels[apt.serviceType]}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-gray-600">{apt.startTime} - {apt.endTime}</td>
                    <td className="py-2 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        apt.status === 'concluido' ? 'bg-gray-100 text-gray-600' :
                        apt.status === 'confirmado' ? 'bg-green-100 text-green-700' :
                        apt.status === 'agendado' ? 'bg-blue-100 text-blue-700' :
                        apt.status === 'falta' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-2">
                      <span className={`text-xs font-medium ${apt.paymentStatus === 'pago' ? 'text-green-600' : 'text-orange-500'}`}>
                        {apt.paymentStatus === 'pago' ? '✓ Pago' : 'Pendente'} · R$ {apt.value.toFixed(2).replace('.', ',')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Patient Form ----
function PatientForm({ onClose }: { onClose: () => void }) {
  const { addPatient } = useApp();
  const [form, setForm] = useState({
    name: '', cpf: '', birthDate: '', gender: 'feminino' as Gender,
    phone: '', whatsapp: '', email: '', status: 'ativo' as PatientStatus,
    services: [] as ServiceType[],
    mainComplaint: '', diagnosis: '', medications: '', allergies: '',
    street: '', number: '', neighborhood: '', city: 'Boituva', state: 'SP', zipCode: '',
    notes: '',
  });

  const toggleService = (s: ServiceType) => {
    setForm(f => ({
      ...f,
      services: f.services.includes(s) ? f.services.filter(x => x !== s) : [...f.services, s],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient: Patient = {
      id: `pat${Date.now()}`,
      name: form.name,
      cpf: form.cpf,
      birthDate: form.birthDate,
      gender: form.gender,
      phone: form.phone,
      whatsapp: form.whatsapp || undefined,
      email: form.email || undefined,
      address: form.street ? {
        street: form.street, number: form.number, neighborhood: form.neighborhood,
        city: form.city, state: form.state, zipCode: form.zipCode,
      } : undefined,
      medicalHistory: form.mainComplaint ? {
        mainComplaint: form.mainComplaint,
        diagnosis: form.diagnosis || undefined,
        medications: form.medications || undefined,
        allergies: form.allergies || undefined,
      } : undefined,
      services: form.services,
      status: form.status,
      registrationDate: format(new Date(), 'yyyy-MM-dd'),
      totalSessions: 0,
      notes: form.notes || undefined,
    };
    addPatient(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end">
      <div className="bg-white h-full w-full max-w-lg overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold text-gray-800">Novo Paciente</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Personal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">Dados Pessoais</h3>
            <div className="space-y-3">
              <div>
                <label className="label">Nome completo *</label>
                <input className="input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">CPF *</label>
                  <input className="input" required value={form.cpf} placeholder="000.000.000-00"
                    onChange={e => setForm(f => ({ ...f, cpf: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Data de Nascimento *</label>
                  <input type="date" className="input" required value={form.birthDate}
                    onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Gênero</label>
                  <select className="input" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value as Gender }))}>
                    <option value="feminino">Feminino</option>
                    <option value="masculino">Masculino</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="label">Status</label>
                  <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as PatientStatus }))}>
                    <option value="ativo">Ativo</option>
                    <option value="aguardando">Aguardando</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Telefone *</label>
                  <input className="input" required value={form.phone} placeholder="(15) 99999-9999"
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="label">WhatsApp</label>
                  <input className="input" value={form.whatsapp} placeholder="(15) 99999-9999"
                    onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="label">E-mail</label>
                <input type="email" className="input" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">Serviços</h3>
            <div className="flex flex-wrap gap-2">
              {allServices.map(s => (
                <button
                  type="button" key={s}
                  onClick={() => toggleService(s)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                    form.services.includes(s)
                      ? 'bg-primary-700 text-white border-primary-700'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
                  }`}
                >
                  {serviceLabels[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Medical history */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">Histórico Clínico</h3>
            <div className="space-y-3">
              <div>
                <label className="label">Queixa principal</label>
                <input className="input" value={form.mainComplaint}
                  onChange={e => setForm(f => ({ ...f, mainComplaint: e.target.value }))} />
              </div>
              <div>
                <label className="label">Diagnóstico</label>
                <input className="input" value={form.diagnosis}
                  onChange={e => setForm(f => ({ ...f, diagnosis: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Medicamentos</label>
                  <input className="input" value={form.medications}
                    onChange={e => setForm(f => ({ ...f, medications: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Alergias</label>
                  <input className="input" value={form.allergies}
                    onChange={e => setForm(f => ({ ...f, allergies: e.target.value }))} />
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">Endereço</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="label">Rua</label>
                  <input className="input" value={form.street}
                    onChange={e => setForm(f => ({ ...f, street: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Número</label>
                  <input className="input" value={form.number}
                    onChange={e => setForm(f => ({ ...f, number: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Bairro</label>
                  <input className="input" value={form.neighborhood}
                    onChange={e => setForm(f => ({ ...f, neighborhood: e.target.value }))} />
                </div>
                <div>
                  <label className="label">CEP</label>
                  <input className="input" value={form.zipCode}
                    onChange={e => setForm(f => ({ ...f, zipCode: e.target.value }))} />
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="label">Observações</label>
            <textarea className="input min-h-[80px] resize-y" value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-ghost border border-gray-300">
              Cancelar
            </button>
            <button type="submit" className="flex-1 btn-primary flex items-center justify-center gap-2">
              <Save size={16} /> Salvar Paciente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---- Main Patients Page ----
export default function Patients() {
  const { patients, setSelectedPatientId, selectedPatientId } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [serviceFilter, setServiceFilter] = useState<string>('todos');
  const [showForm, setShowForm] = useState(false);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  if (selectedPatient) {
    return <PatientDetail patient={selectedPatient} onBack={() => setSelectedPatientId(null)} />;
  }

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.cpf.includes(search) ||
      p.phone.includes(search);
    const matchStatus = statusFilter === 'todos' || p.status === statusFilter;
    const matchService = serviceFilter === 'todos' || p.services.includes(serviceFilter as ServiceType);
    return matchSearch && matchStatus && matchService;
  });

  return (
    <div className="space-y-4">
      {showForm && <PatientForm onClose={() => setShowForm(false)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{filtered.length} de {patients.length} pacientes</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Novo Paciente
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 flex-1">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Buscar por nome, CPF ou telefone..."
              className="bg-transparent text-sm text-gray-700 outline-none w-full placeholder-gray-400"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400 flex-shrink-0" />
              <select
                className="text-sm border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="todos">Todos status</option>
                <option value="ativo">Ativo</option>
                <option value="aguardando">Aguardando</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
            <select
              className="text-sm border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              value={serviceFilter}
              onChange={e => setServiceFilter(e.target.value)}
            >
              <option value="todos">Todos serviços</option>
              {allServices.map(s => (
                <option key={s} value={s}>{serviceLabels[s]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <div className="card text-center py-12">
            <User size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Nenhum paciente encontrado</p>
          </div>
        ) : (
          filtered.map(patient => {
            const age = differenceInYears(new Date(), parseISO(patient.birthDate));
            return (
              <div
                key={patient.id}
                className="card hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedPatientId(patient.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-700 text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {patient.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-800">{patient.name}</span>
                      <StatusBadge status={patient.status} />
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-0.5">
                      <span>{age} anos</span>
                      <span className="flex items-center gap-1"><Phone size={12} />{patient.phone}</span>
                      {patient.lastVisit && (
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          Última visita: {format(parseISO(patient.lastVisit), 'dd/MM/yyyy')}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {patient.services.map(s => (
                        <span key={s} className={`text-xs px-2 py-0.5 rounded-full ${serviceColors[s]}`}>
                          {serviceLabels[s]}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-lg font-bold text-primary-700">{patient.totalSessions}</p>
                      <p className="text-xs text-gray-400">sessões</p>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
