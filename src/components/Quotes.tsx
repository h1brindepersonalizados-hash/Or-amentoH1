import React, { useState } from 'react';
import { Plus, Search, FileText, Trash2, Edit2, Printer } from 'lucide-react';
import { Quote, Customer, Product } from '../types';
import { Button } from './Button';
import { QuoteForm } from './QuoteForm';

export function Quotes({
  quotes,
  setQuotes,
  customers,
  products,
  onPrint,
}: {
  quotes: Quote[];
  setQuotes: (q: Quote[]) => void;
  customers: Customer[];
  products: Product[];
  onPrint: (quote: Quote) => void;
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [search, setSearch] = useState('');

  const handleEdit = (quote: Quote) => {
    setEditingQuote(quote);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este orçamento?')) {
      setQuotes(quotes.filter((q) => q.id !== id));
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingQuote(null);
  };

  const filteredQuotes = quotes.filter(
    (q) =>
      q.customerName.toLowerCase().includes(search.toLowerCase()) ||
      q.id.includes(search)
  );

  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'Aprovado':
        return 'bg-green-100 text-green-800';
      case 'Rejeitado':
        return 'bg-red-100 text-red-800';
      case 'Enviado':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isFormOpen) {
    return (
      <QuoteForm
        quote={editingQuote}
        customers={customers}
        products={products}
        onSave={(newQuote) => {
          if (editingQuote) {
            setQuotes(quotes.map((q) => (q.id === newQuote.id ? newQuote : q)));
          } else {
            setQuotes([newQuote, ...quotes]);
          }
          closeForm();
        }}
        onCancel={closeForm}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Orçamentos</h2>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-5 h-5" /> Novo Orçamento
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente ou ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Nenhum orçamento encontrado.
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {quote.id.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {quote.customerName}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(quote.date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        timeZone: 'UTC'
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(quote.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          quote.status
                        )}`}
                      >
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => onPrint(quote)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Imprimir / PDF"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(quote)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(quote.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
