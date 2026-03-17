import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { serviceLabels } from '../data/mockData';

const paymentMethodLabels: Record<string, string> = {
  pix: 'PIX',
  dinheiro: 'Dinheiro',
  cartao_credito: 'Cartão de Crédito',
  cartao_debito: 'Cartão de Débito',
  convenio: 'Convênio',
};

const paymentMethodIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  pix: Smartphone,
  dinheiro: Banknote,
  cartao_credito: CreditCard,
  cartao_debito: CreditCard,
  convenio: Building2,
};

export default function Financial() {
  const { appointments } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

  const monthStart = startOfMonth(parseISO(`${selectedMonth}-01`));
  const monthEnd = endOfMonth(parseISO(`${selectedMonth}-01`));

  const monthAppointments = appointments.filter(a =>
    isWithinInterval(parseISO(a.date), { start: monthStart, end: monthEnd })
  );

  const paidAppointments = monthAppointments.filter(a => a.paymentStatus === 'pago');
  const pendingAppointments = monthAppointments.filter(a =>
    a.paymentStatus === 'pendente' && !['cancelado', 'falta'].includes(a.status)
  );

  const totalRevenue = paidAppointments.reduce((s, a) => s + a.value, 0);
  const pendingRevenue = pendingAppointments.reduce((s, a) => s + a.value, 0);
  const totalScheduled = monthAppointments.reduce((s, a) => s + a.value, 0);

  // Revenue by service
  const byService = monthAppointments.reduce((acc, a) => {
    if (!acc[a.serviceType]) acc[a.serviceType] = { total: 0, paid: 0, count: 0 };
    acc[a.serviceType].total += a.value;
    if (a.paymentStatus === 'pago') acc[a.serviceType].paid += a.value;
    acc[a.serviceType].count += 1;
    return acc;
  }, {} as Record<string, { total: number; paid: number; count: number }>);

  // Revenue by method
  const byMethod = paidAppointments.reduce((acc, a) => {
    const method = a.paymentMethod || 'outros';
    if (!acc[method]) acc[method] = 0;
    acc[method] += a.value;
    return acc;
  }, {} as Record<string, number>);

  // Recent payments
  const recentPaid = [...paidAppointments]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);

  const serviceColors: Record<string, string> = {
    fisioterapia: 'bg-primary-500',
    pilates: 'bg-accent-500',
    pilates_kids: 'bg-yellow-500',
    liberacao_miofascial: 'bg-purple-500',
    ventosaterapia: 'bg-red-500',
    reabilitacao: 'bg-cyan-500',
  };

  return (
    <div className="space-y-6">
      {/* Month selector */}
      <div className="flex items-center gap-3">
        <input
          type="month"
          className="input w-auto"
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
        />
        <span className="text-gray-500 text-sm capitalize">
          {format(monthStart, "MMMM 'de' yyyy", { locale: ptBR })}
        </span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-200 rounded-lg">
              <CheckCircle2 size={20} className="text-green-700" />
            </div>
            <div>
              <p className="text-xs font-medium text-green-600">Receita Recebida</p>
              <p className="text-2xl font-bold text-green-800">
                R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-green-600">{paidAppointments.length} pagamentos</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-200 rounded-lg">
              <AlertCircle size={20} className="text-orange-700" />
            </div>
            <div>
              <p className="text-xs font-medium text-orange-600">Pendente</p>
              <p className="text-2xl font-bold text-orange-800">
                R$ {pendingRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-orange-600">{pendingAppointments.length} pagamentos</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-200 rounded-lg">
              <TrendingUp size={20} className="text-primary-700" />
            </div>
            <div>
              <p className="text-xs font-medium text-primary-600">Total Agendado</p>
              <p className="text-2xl font-bold text-primary-800">
                R$ {totalScheduled.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-primary-600">{monthAppointments.length} atendimentos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by service */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Receita por Serviço</h3>
          {Object.entries(byService).length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">Sem dados para este período</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(byService)
                .sort(([, a], [, b]) => b.paid - a.paid)
                .map(([type, data]) => (
                  <div key={type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{serviceLabels[type]}</span>
                      <div className="flex gap-3 text-right">
                        <span className="text-green-600 font-semibold">
                          R$ {data.paid.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="text-gray-400 text-xs">/{data.count} sessões</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${serviceColors[type] || 'bg-gray-500'}`}
                        style={{ width: `${totalRevenue > 0 ? (data.paid / totalRevenue) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Revenue by payment method */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Forma de Pagamento</h3>
          {Object.entries(byMethod).length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">Nenhum pagamento registrado</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(byMethod)
                .sort(([, a], [, b]) => b - a)
                .map(([method, value]) => {
                  const Icon = paymentMethodIcons[method] || DollarSign;
                  const pct = totalRevenue > 0 ? (value / totalRevenue) * 100 : 0;
                  return (
                    <div key={method} className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                        <Icon size={14} className="text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{paymentMethodLabels[method] || method}</span>
                          <span className="font-semibold text-gray-800">
                            R$ {value.toFixed(2).replace('.', ',')} <span className="text-xs text-gray-400 font-normal">({pct.toFixed(0)}%)</span>
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-500 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Recent payments table */}
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Pagamentos Recebidos</h3>
        {recentPaid.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">Nenhum pagamento registrado neste período</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 pr-4 text-gray-500 font-medium">Data</th>
                  <th className="text-left py-2 pr-4 text-gray-500 font-medium">Paciente</th>
                  <th className="text-left py-2 pr-4 text-gray-500 font-medium">Serviço</th>
                  <th className="text-left py-2 pr-4 text-gray-500 font-medium">Forma</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Valor</th>
                </tr>
              </thead>
              <tbody>
                {recentPaid.map(apt => (
                  <tr key={apt.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 pr-4 text-gray-700">{format(parseISO(apt.date), 'dd/MM/yyyy')}</td>
                    <td className="py-2.5 pr-4 font-medium text-gray-800">{apt.patientName}</td>
                    <td className="py-2.5 pr-4">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                        {serviceLabels[apt.serviceType]}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-gray-600">
                      {apt.paymentMethod ? paymentMethodLabels[apt.paymentMethod] : '—'}
                    </td>
                    <td className="py-2.5 text-right font-semibold text-green-700">
                      R$ {apt.value.toFixed(2).replace('.', ',')}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-200">
                  <td colSpan={4} className="py-2.5 pr-4 font-semibold text-gray-700">Total</td>
                  <td className="py-2.5 text-right font-bold text-green-700">
                    R$ {totalRevenue.toFixed(2).replace('.', ',')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Pending payments */}
      {pendingAppointments.length > 0 && (
        <div className="card border-orange-200">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle size={16} className="text-orange-500" />
            Pagamentos Pendentes
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 pr-4 text-gray-500 font-medium">Data</th>
                  <th className="text-left py-2 pr-4 text-gray-500 font-medium">Paciente</th>
                  <th className="text-left py-2 pr-4 text-gray-500 font-medium">Serviço</th>
                  <th className="text-left py-2 pr-4 text-gray-500 font-medium">Status</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Valor</th>
                </tr>
              </thead>
              <tbody>
                {pendingAppointments
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map(apt => (
                    <tr key={apt.id} className="border-b border-gray-50 hover:bg-orange-50">
                      <td className="py-2.5 pr-4 text-gray-700">{format(parseISO(apt.date), 'dd/MM/yyyy')}</td>
                      <td className="py-2.5 pr-4 font-medium text-gray-800">{apt.patientName}</td>
                      <td className="py-2.5 pr-4 text-gray-600">{serviceLabels[apt.serviceType]}</td>
                      <td className="py-2.5 pr-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          apt.status === 'agendado' ? 'bg-blue-100 text-blue-700' :
                          apt.status === 'confirmado' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-semibold text-orange-600">
                        R$ {apt.value.toFixed(2).replace('.', ',')}
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-200">
                  <td colSpan={4} className="py-2.5 pr-4 font-semibold text-gray-700">Total pendente</td>
                  <td className="py-2.5 text-right font-bold text-orange-600">
                    R$ {pendingRevenue.toFixed(2).replace('.', ',')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
