import React from 'react';
import { Customer, Product, Quote } from '../types';
import { Users, Package, FileText, TrendingUp } from 'lucide-react';

export function Dashboard({
  customers,
  products,
  quotes,
}: {
  customers: Customer[];
  products: Product[];
  quotes: Quote[];
}) {
  const totalRevenue = quotes
    .filter((q) => q.status === 'Aprovado')
    .reduce((acc, q) => acc + q.total, 0);

  const pendingQuotes = quotes.filter((q) => q.status === 'Enviado').length;

  const stats = [
    {
      label: 'Total de Clientes',
      value: customers.length,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: 'Produtos Cadastrados',
      value: products.length,
      icon: Package,
      color: 'bg-indigo-500',
    },
    {
      label: 'Orçamentos Pendentes',
      value: pendingQuotes,
      icon: FileText,
      color: 'bg-amber-500',
    },
    {
      label: 'Receita Aprovada',
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(totalRevenue),
      icon: TrendingUp,
      color: 'bg-emerald-500',
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.color}`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Últimos Orçamentos
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Cliente</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3 rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {quotes.slice(0, 5).map((quote) => (
                <tr key={quote.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {quote.customerName}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(quote.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      timeZone: 'UTC'
                    })}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(quote.total)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        quote.status === 'Aprovado'
                          ? 'bg-green-100 text-green-800'
                          : quote.status === 'Rejeitado'
                          ? 'bg-red-100 text-red-800'
                          : quote.status === 'Enviado'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {quote.status}
                    </span>
                  </td>
                </tr>
              ))}
              {quotes.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Nenhum orçamento recente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
