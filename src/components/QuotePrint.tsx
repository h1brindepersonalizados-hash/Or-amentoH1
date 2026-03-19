import React, { useRef, useState } from 'react';
import { Quote, Company, Customer } from '../types';
import { Printer, ArrowLeft, Building2, User, Download, Loader2 } from 'lucide-react';
import { Button } from './Button';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

export function QuotePrint({
  quote,
  company,
  customer,
  onBack
}: {
  quote: Quote;
  company: Company;
  customer?: Customer;
  onBack: () => void;
}) {
  const printRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    
    try {
      setIsGenerating(true);
      const element = printRef.current;
      
      // Temporarily adjust styles for better PDF rendering
      const originalStyle = element.style.cssText;
      element.style.width = '800px';
      element.style.maxWidth = '800px';
      element.style.margin = '0';
      element.style.padding = '40px';
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // Restore original styles
      element.style.cssText = originalStyle;
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`orcamento-${quote.id.substring(0, 8).toUpperCase()}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Ocorreu um erro ao gerar o PDF. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 print:p-0 print:bg-white">
      <style type="text/css" media="print">
        {`
          @page { size: A4 portrait; margin: 15mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        `}
      </style>
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Button variant="secondary" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handlePrint}>
            <Printer className="w-4 h-4" /> Imprimir
          </Button>
          <Button onClick={handleDownloadPDF} disabled={isGenerating}>
            {isGenerating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Gerando PDF...</>
            ) : (
              <><Download className="w-4 h-4" /> Baixar PDF</>
            )}
          </Button>
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-8 print:overflow-visible print:pb-0">
        <div ref={printRef} className="w-[800px] mx-auto bg-white p-10 shadow-lg print:shadow-none print:p-0 shrink-0 print:w-full print:max-w-full">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
            <div className="flex items-center gap-6">
            {company.logo ? (
              <img src={company.logo} alt="Logo" className="w-24 h-24 object-contain" />
            ) : (
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                <Building2 className="w-10 h-10 text-gray-400" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{company.name || 'Sua Empresa'}</h1>
              {company.document && <p className="text-gray-600 text-sm">{company.document}</p>}
              <p className="text-gray-600 text-sm">{company.email} {company.phone && `| ${company.phone}`}</p>
              <p className="text-gray-600 text-sm whitespace-pre-wrap">{company.address}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-light text-gray-400 uppercase tracking-wider mb-2">Orçamento</h2>
            <p className="text-gray-900 font-medium">Nº {quote.id.substring(0, 8).toUpperCase()}</p>
            <p className="text-gray-600 text-sm">Data: {new Date(quote.date).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              timeZone: 'UTC'
            })}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-8 flex items-start gap-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Cliente</h3>
            <p className="text-gray-900 font-bold text-lg">{quote.customerName}</p>
            {customer?.document && <p className="text-gray-600 text-sm">Doc: {customer.document}</p>}
            <p className="text-gray-600 text-sm">{customer?.email} {customer?.phone && `| ${customer.phone}`}</p>
            <p className="text-gray-600 text-sm whitespace-pre-wrap">{customer?.address}</p>
            {customer?.sendDate && (
              <p className="text-gray-600 text-sm mt-1">
                <span className="font-semibold">Data de Envio:</span> {new Date(customer.sendDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
              </p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-y border-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Item</th>
                <th className="px-4 py-3 font-semibold text-center">Qtd</th>
                <th className="px-4 py-3 font-semibold text-right">Preço Unit.</th>
                <th className="px-4 py-3 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {quote.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 text-gray-900">{item.productName}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900 font-medium">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Notes */}
        <div className="flex justify-between gap-8">
          <div className="flex-1">
            {quote.notes && (
              <div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Observações</h3>
                <p className="text-gray-600 text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded-lg print:bg-transparent print:p-0 print:border-none">
                  {quote.notes}
                </p>
              </div>
            )}
          </div>
          <div className="w-72 space-y-3">
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Subtotal:</span>
              <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.subtotal)}</span>
            </div>
            {quote.discount > 0 && (
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Desconto:</span>
                <span className="text-red-600">
                  -{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.discount)}
                </span>
              </div>
            )}
            {(quote.shipping || 0) > 0 && (
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Frete:</span>
                <span>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.shipping || 0)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-gray-900 font-bold text-lg pt-3 border-t border-gray-200">
              <span>Total:</span>
              <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.total)}</span>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-400 text-xs">
          <p>Orçamento gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
        </div>
        </div>
      </div>
    </div>
  );
}
