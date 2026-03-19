import React, { useState, useEffect } from 'react';
import { Customer, Product, Quote, QuoteItem } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Button } from './Button';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';

export function QuoteForm({
  quote,
  customers,
  products,
  onSave,
  onCancel,
}: {
  quote: Quote | null;
  customers: Customer[];
  products: Product[];
  onSave: (quote: Quote) => void;
  onCancel: () => void;
}) {
  const [customerId, setCustomerId] = useState(quote?.customerId || '');
  const [date, setDate] = useState(
    quote?.date || new Date().toISOString().split('T')[0]
  );
  const [items, setItems] = useState<QuoteItem[]>(quote?.items || []);
  const [discount, setDiscount] = useState(quote?.discount || 0);
  const [shipping, setShipping] = useState(quote?.shipping || 0);
  const [status, setStatus] = useState<Quote['status']>(
    quote?.status || 'Rascunho'
  );
  const [notes, setNotes] = useState(quote?.notes || '');

  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const total = Math.max(0, subtotal + shipping - discount);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: uuidv4(),
        productId: '',
        productName: '',
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (
    id: string,
    field: keyof QuoteItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;

        const updatedItem = { ...item, [field]: value };

        if (field === 'productId') {
          const product = products.find((p) => p.id === value);
          if (product) {
            updatedItem.productName = product.name;
            updatedItem.unitPrice = product.price;
            updatedItem.totalPrice = product.price * updatedItem.quantity;
          }
        }

        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.totalPrice =
            updatedItem.quantity * updatedItem.unitPrice;
        }

        return updatedItem;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return alert('Selecione um cliente.');
    if (items.length === 0) return alert('Adicione pelo menos um item.');
    if (items.some((i) => !i.productId))
      return alert('Selecione um produto para todos os itens.');

    const customer = customers.find((c) => c.id === customerId);

    onSave({
      id: quote?.id || uuidv4(),
      customerId,
      customerName: customer?.name || '',
      date,
      items,
      subtotal,
      discount,
      shipping,
      total,
      status,
      notes,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          {quote ? 'Editar Orçamento' : 'Novo Orçamento'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cliente
            </label>
            <select
              required
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
            >
              <option value="">Selecione um cliente...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data
            </label>
            <input
              required
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Quote['status'])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
            >
              <option value="Rascunho">Rascunho</option>
              <option value="Enviado">Enviado</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Rejeitado">Rejeitado</option>
            </select>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Itens</h3>
            <Button variant="secondary" onClick={handleAddItem}>
              <Plus className="w-4 h-4" /> Adicionar Item
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-wrap md:flex-nowrap gap-4 items-end bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Produto/Serviço
                  </label>
                  <select
                    required
                    value={item.productId}
                    onChange={(e) =>
                      handleItemChange(item.id, 'productId', e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                  >
                    <option value="">Selecione...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-24">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qtd
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(
                        item.id,
                        'quantity',
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço Unit.
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(
                        item.id,
                        'unitPrice',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total
                  </label>
                  <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 font-medium">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(item.totalPrice)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                Nenhum item adicionado.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              rows={5}
              placeholder="Condições de pagamento, validade do orçamento, etc..."
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-gray-600">
              <span>Subtotal:</span>
              <span className="font-medium">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(subtotal)}
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span className="flex items-center gap-2">
                Frete (R$):
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={shipping}
                onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
                className="w-32 px-3 py-1 text-right border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span className="flex items-center gap-2">
                Desconto (R$):
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="w-32 px-3 py-1 text-right border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-indigo-600">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(total)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Salvar Orçamento</Button>
        </div>
      </form>
    </div>
  );
}
