import { Clock, DollarSign, Users, Edit2 } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { services } from '../data/mockData';

const serviceTypeColors: Record<string, string> = {
  fisioterapia: '#1a5aa0',
  pilates: '#78bc1f',
  pilates_kids: '#f59e0b',
  liberacao_miofascial: '#8b5cf6',
  ventosaterapia: '#ef4444',
  reabilitacao: '#06b6d4',
};

export default function Services() {
  const { patients, appointments } = useApp();

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(service => {
          const patientCount = patients.filter(p => p.services.includes(service.type)).length;
          const aptCount = appointments.filter(a => a.serviceType === service.type).length;
          const revenue = appointments
            .filter(a => a.serviceType === service.type && a.paymentStatus === 'pago')
            .reduce((s, a) => s + a.value, 0);

          return (
            <div key={service.id} className="card relative overflow-hidden">
              {/* Color accent */}
              <div
                className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
                style={{ backgroundColor: serviceTypeColors[service.type] }}
              />
              <div className="pl-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{service.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{service.description}</p>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 flex-shrink-0">
                    <Edit2 size={14} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Clock size={13} style={{ color: serviceTypeColors[service.type] }} />
                    <span>{service.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <DollarSign size={13} style={{ color: serviceTypeColors[service.type] }} />
                    <span className="font-medium">R$ {service.price.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold" style={{ color: serviceTypeColors[service.type] }}>{patientCount}</p>
                    <p className="text-xs text-gray-400">pacientes</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-700">{aptCount}</p>
                    <p className="text-xs text-gray-400">sessões</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-600">R$ {revenue.toFixed(0)}</p>
                    <p className="text-xs text-gray-400">receita</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Professional */}
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Profissional</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-700 text-white flex items-center justify-center text-2xl font-bold">
            K
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-lg">Ketty Marcon Gianotti</p>
            <p className="text-primary-600 font-medium text-sm">CREFITO3: 74.249-F</p>
            <p className="text-gray-500 text-sm mt-0.5">Fisioterapeuta & Instrutora de Pilates</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {['Fisioterapia', 'Pilates', 'Liberação Miofascial', 'Ventosaterapia'].map(s => (
                <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">{s}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-700">{patients.filter(p => p.status === 'ativo').length}</p>
            <p className="text-xs text-gray-500">Pacientes ativos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent-600">{appointments.filter(a => a.status === 'concluido').length}</p>
            <p className="text-xs text-gray-500">Sessões concluídas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-700">{services.length}</p>
            <p className="text-xs text-gray-500">Serviços oferecidos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              R$ {appointments
                .filter(a => a.paymentStatus === 'pago')
                .reduce((s, a) => s + a.value, 0)
                .toFixed(0)}
            </p>
            <p className="text-xs text-gray-500">Receita total</p>
          </div>
        </div>
      </div>

      {/* Service price table */}
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Tabela de Valores</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 pr-4 text-gray-500 font-medium">Serviço</th>
                <th className="text-left py-2 pr-4 text-gray-500 font-medium">Duração</th>
                <th className="text-left py-2 pr-4 text-gray-500 font-medium">Valor</th>
                <th className="text-left py-2 text-gray-500 font-medium">Pacientes</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => {
                const patientCount = patients.filter(p => p.services.includes(service.type)).length;
                return (
                  <tr key={service.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: serviceTypeColors[service.type] }}
                        />
                        <span className="font-medium text-gray-800">{service.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{service.duration} min</td>
                    <td className="py-3 pr-4 font-semibold text-gray-800">
                      R$ {service.price.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users size={14} />
                        <span>{patientCount}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
