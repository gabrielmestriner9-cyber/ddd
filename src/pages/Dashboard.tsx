import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { serviceLabels } from '../data/mockData';

const statusColors: Record<string, string> = {
  agendado: 'bg-blue-100 text-blue-700',
  confirmado: 'bg-green-100 text-green-700',
  concluido: 'bg-gray-100 text-gray-600',
  cancelado: 'bg-red-100 text-red-600',
  falta: 'bg-orange-100 text-orange-700',
};

const serviceColors: Record<string, string> = {
  fisioterapia: 'bg-primary-100 text-primary-700 border-primary-200',
  pilates: 'bg-accent-100 text-accent-700 border-accent-200',
  pilates_kids: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  liberacao_miofascial: 'bg-purple-100 text-purple-700 border-purple-200',
  ventosaterapia: 'bg-red-100 text-red-700 border-red-200',
  reabilitacao: 'bg-cyan-100 text-cyan-700 border-cyan-200',
};

export default function Dashboard() {
  const { patients, appointments, payments, setCurrentPage } = useApp();

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const activePatients = patients.filter(p => p.status === 'ativo').length;
  const pendingPatients = patients.filter(p => p.status === 'aguardando').length;

  const monthRevenue = payments
    .filter(p => p.status === 'pago' && p.date.startsWith('2026-03'))
    .reduce((sum, p) => sum + p.value, 0);

  const todayRevenue = payments
    .filter(p => p.status === 'pago' && p.date === todayStr)
    .reduce((sum, p) => sum + p.value, 0);

  const completedToday = todayAppointments.filter(a => a.status === 'concluido').length;
  const pendingToday = todayAppointments.filter(a => ['agendado', 'confirmado'].includes(a.status)).length;

  const upcomingAppointments = appointments
    .filter(a => a.date >= todayStr && ['agendado', 'confirmado'].includes(a.status))
    .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`))
    .slice(0, 6);

  const stats = [
    {
      label: 'Pacientes Ativos',
      value: activePatients,
      sub: `${pendingPatients} aguardando avaliação`,
      icon: Users,
      color: 'bg-primary-50 text-primary-700',
      iconBg: 'bg-primary-100',
    },
    {
      label: 'Atendimentos Hoje',
      value: todayAppointments.length,
      sub: `${completedToday} concluídos · ${pendingToday} pendentes`,
      icon: Calendar,
      color: 'bg-accent-50 text-accent-700',
      iconBg: 'bg-accent-100',
    },
    {
      label: 'Receita do Mês',
      value: `R$ ${monthRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      sub: `R$ ${todayRevenue.toFixed(2).replace('.', ',')} hoje`,
      icon: DollarSign,
      color: 'bg-green-50 text-green-700',
      iconBg: 'bg-green-100',
    },
    {
      label: 'Taxa de Ocupação',
      value: `${Math.round((completedToday / Math.max(todayAppointments.length, 1)) * 100)}%`,
      sub: 'Sessões concluídas hoje',
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-700',
      iconBg: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="card bg-gradient-to-r from-primary-700 to-primary-900 text-white border-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">
              Bom dia, Ketty! 👋
            </h2>
            <p className="text-primary-200 text-sm mt-1">
              {format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-primary-200 text-sm">Hoje você tem</p>
            <p className="text-3xl font-bold">{todayAppointments.length}</p>
            <p className="text-primary-200 text-sm">atendimentos</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card flex items-start gap-4">
              <div className={`${stat.iconBg} p-2.5 rounded-lg flex-shrink-0`}>
                <Icon size={20} className={stat.color.split(' ')[1]} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-gray-800 leading-tight">{stat.value}</p>
                <p className="text-xs font-medium text-gray-500 mt-0.5">{stat.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="xl:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Agenda de Hoje</h3>
            <button
              onClick={() => setCurrentPage('appointments')}
              className="text-primary-600 text-sm font-medium flex items-center gap-1 hover:text-primary-800"
            >
              Ver tudo <ChevronRight size={14} />
            </button>
          </div>

          {todayAppointments.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Nenhum agendamento para hoje</p>
          ) : (
            <div className="space-y-2">
              {todayAppointments
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map(apt => (
                  <div key={apt.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="text-center flex-shrink-0 w-14">
                      <p className="text-xs font-bold text-gray-700">{apt.startTime}</p>
                      <p className="text-xs text-gray-400">{apt.endTime}</p>
                    </div>
                    <div className={`w-1 h-10 rounded-full flex-shrink-0 ${
                      apt.serviceType === 'fisioterapia' ? 'bg-primary-500' :
                      apt.serviceType === 'pilates' ? 'bg-accent-500' :
                      apt.serviceType === 'pilates_kids' ? 'bg-yellow-500' :
                      apt.serviceType === 'reabilitacao' ? 'bg-cyan-500' :
                      apt.serviceType === 'liberacao_miofascial' ? 'bg-purple-500' :
                      'bg-red-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-800 truncate">{apt.patientName}</p>
                      <p className="text-xs text-gray-500">{serviceLabels[apt.serviceType]}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[apt.status]}`}>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                      <span className={`text-xs font-medium ${
                        apt.paymentStatus === 'pago' ? 'text-green-600' : 'text-orange-500'
                      }`}>
                        {apt.paymentStatus === 'pago' ? '✓ Pago' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Next appointments */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Próximos</h3>
              <Clock size={16} className="text-gray-400" />
            </div>
            <div className="space-y-3">
              {upcomingAppointments.filter(a => a.date > todayStr).slice(0, 4).map(apt => (
                <div key={apt.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{apt.patientName}</p>
                    <p className="text-xs text-gray-400">
                      {format(parseISO(apt.date), 'dd/MM')} às {apt.startTime} · {serviceLabels[apt.serviceType]}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${serviceColors[apt.serviceType]}`}>
                    {serviceLabels[apt.serviceType].split(' ')[0]}
                  </span>
                </div>
              ))}
              {upcomingAppointments.filter(a => a.date > todayStr).length === 0 && (
                <p className="text-gray-400 text-xs text-center py-2">Nenhum próximo agendamento</p>
              )}
            </div>
          </div>

          {/* Alerts */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-3">Alertas</h3>
            <div className="space-y-2">
              {pendingPatients > 0 && (
                <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded-lg">
                  <AlertCircle size={14} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-yellow-700">
                    {pendingPatients} paciente(s) aguardando avaliação inicial
                  </p>
                </div>
              )}
              {appointments.filter(a => a.status === 'falta' && a.date >= format(new Date(Date.now() - 7*24*60*60*1000), 'yyyy-MM-dd')).length > 0 && (
                <div className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg">
                  <AlertCircle size={14} className="text-orange-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-orange-700">
                    {appointments.filter(a => a.status === 'falta' && a.date >= format(new Date(Date.now() - 7*24*60*60*1000), 'yyyy-MM-dd')).length} falta(s) nos últimos 7 dias
                  </p>
                </div>
              )}
              {appointments.filter(a => a.paymentStatus === 'pendente' && a.status === 'concluido').length > 0 && (
                <div className="flex items-start gap-2 p-2 bg-red-50 rounded-lg">
                  <AlertCircle size={14} className="text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-700">
                    {appointments.filter(a => a.paymentStatus === 'pendente' && a.status === 'concluido').length} pagamento(s) pendente(s)
                  </p>
                </div>
              )}
              <div className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
                <CheckCircle2 size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-green-700">
                  {activePatients} pacientes ativos este mês
                </p>
              </div>
            </div>
          </div>

          {/* Service distribution */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-3">Serviços</h3>
            {Object.entries(
              patients.reduce((acc, p) => {
                p.services.forEach(s => { acc[s] = (acc[s] || 0) + 1; });
                return acc;
              }, {} as Record<string, number>)
            )
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([service, count]) => (
                <div key={service} className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">{serviceLabels[service]}</span>
                    <span className="font-medium text-gray-800">{count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        service === 'fisioterapia' ? 'bg-primary-500' :
                        service === 'pilates' ? 'bg-accent-500' :
                        service === 'pilates_kids' ? 'bg-yellow-500' :
                        service === 'reabilitacao' ? 'bg-cyan-500' :
                        service === 'liberacao_miofascial' ? 'bg-purple-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${(count / patients.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
