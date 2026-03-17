import { useApp } from '../store/AppContext';
import { serviceLabels } from '../data/mockData';
import { BarChart2, Users, Calendar, TrendingUp } from 'lucide-react';

const serviceColors: Record<string, string> = {
  fisioterapia: '#1a5aa0',
  pilates: '#78bc1f',
  pilates_kids: '#f59e0b',
  liberacao_miofascial: '#8b5cf6',
  ventosaterapia: '#ef4444',
  reabilitacao: '#06b6d4',
};

export default function Reports() {
  const { patients, appointments } = useApp();

  // Patient stats
  const activeCount = patients.filter(p => p.status === 'ativo').length;
  const inactiveCount = patients.filter(p => p.status === 'inativo').length;
  const waitingCount = patients.filter(p => p.status === 'aguardando').length;

  // Gender distribution
  const genderDist = patients.reduce((acc, p) => {
    acc[p.gender] = (acc[p.gender] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Service distribution
  const serviceDist = patients.reduce((acc, p) => {
    p.services.forEach(s => { acc[s] = (acc[s] || 0) + 1; });
    return acc;
  }, {} as Record<string, number>);

  // Appointment stats
  const completedApts = appointments.filter(a => a.status === 'concluido').length;
  const cancelledApts = appointments.filter(a => a.status === 'cancelado').length;
  const faultApts = appointments.filter(a => a.status === 'falta').length;
  const totalApts = appointments.length;

  // Revenue total
  const totalRevenue = appointments
    .filter(a => a.paymentStatus === 'pago')
    .reduce((s, a) => s + a.value, 0);

  // Top patients by sessions
  const topPatients = [...patients]
    .sort((a, b) => b.totalSessions - a.totalSessions)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <Users size={24} className="mx-auto text-primary-600 mb-2" />
          <p className="text-3xl font-bold text-primary-700">{patients.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total de Pacientes</p>
        </div>
        <div className="card text-center">
          <Calendar size={24} className="mx-auto text-accent-600 mb-2" />
          <p className="text-3xl font-bold text-accent-600">{totalApts}</p>
          <p className="text-xs text-gray-500 mt-1">Total de Sessões</p>
        </div>
        <div className="card text-center">
          <TrendingUp size={24} className="mx-auto text-green-600 mb-2" />
          <p className="text-2xl font-bold text-green-700">
            R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-gray-500 mt-1">Receita Total</p>
        </div>
        <div className="card text-center">
          <BarChart2 size={24} className="mx-auto text-purple-600 mb-2" />
          <p className="text-3xl font-bold text-purple-700">
            {totalApts > 0 ? Math.round((completedApts / totalApts) * 100) : 0}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Taxa de Conclusão</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient status */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Status dos Pacientes</h3>
          <div className="flex items-end gap-6 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{activeCount}</div>
              <div className="text-xs text-gray-500 mt-1">Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{waitingCount}</div>
              <div className="text-xs text-gray-500 mt-1">Aguardando</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-500">{inactiveCount}</div>
              <div className="text-xs text-gray-500 mt-1">Inativos</div>
            </div>
          </div>

          {/* Visual bar */}
          <div className="h-3 rounded-full overflow-hidden flex gap-0.5">
            {activeCount > 0 && (
              <div className="bg-green-500 h-full rounded-l-full" style={{ flex: activeCount }} />
            )}
            {waitingCount > 0 && (
              <div className="bg-yellow-400 h-full" style={{ flex: waitingCount }} />
            )}
            {inactiveCount > 0 && (
              <div className="bg-gray-300 h-full rounded-r-full" style={{ flex: inactiveCount }} />
            )}
          </div>
          <div className="flex gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span>Ativo</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400"></span>Aguardando</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300"></span>Inativo</span>
          </div>
        </div>

        {/* Appointment status */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Status dos Atendimentos</h3>
          <div className="space-y-2">
            {[
              { label: 'Concluídos', count: completedApts, color: 'bg-gray-400' },
              { label: 'Agendados', count: appointments.filter(a => a.status === 'agendado').length, color: 'bg-blue-400' },
              { label: 'Confirmados', count: appointments.filter(a => a.status === 'confirmado').length, color: 'bg-green-400' },
              { label: 'Cancelados', count: cancelledApts, color: 'bg-red-400' },
              { label: 'Faltas', count: faultApts, color: 'bg-orange-400' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium text-gray-800">{item.count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${totalApts > 0 ? (item.count / totalApts) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services distribution */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Distribuição por Serviço</h3>
          <div className="space-y-3">
            {Object.entries(serviceDist)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count]) => (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{serviceLabels[type]}</span>
                    <span className="font-medium text-gray-800">
                      {count} paciente{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(count / patients.length) * 100}%`,
                        backgroundColor: serviceColors[type],
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Top patients */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Pacientes mais Frequentes</h3>
          <div className="space-y-3">
            {topPatients.map((patient, idx) => (
              <div key={patient.id} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                  idx === 1 ? 'bg-gray-100 text-gray-600' :
                  idx === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-50 text-gray-500'
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{patient.name}</p>
                  <div className="flex gap-1 flex-wrap">
                    {patient.services.slice(0, 2).map(s => (
                      <span key={s} className="text-xs text-gray-400">{serviceLabels[s]}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-primary-700">{patient.totalSessions}</p>
                  <p className="text-xs text-gray-400">sessões</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gender distribution */}
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Perfil dos Pacientes por Gênero</h3>
        <div className="flex flex-wrap gap-6">
          {Object.entries(genderDist).map(([g, count]) => (
            <div key={g} className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                g === 'feminino' ? 'bg-pink-100 text-pink-600' :
                g === 'masculino' ? 'bg-blue-100 text-blue-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {g === 'feminino' ? '♀' : g === 'masculino' ? '♂' : '⚥'}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800">{count}</p>
                <p className="text-xs text-gray-500 capitalize">{g}</p>
                <p className="text-xs text-gray-400">
                  {Math.round((count / patients.length) * 100)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
