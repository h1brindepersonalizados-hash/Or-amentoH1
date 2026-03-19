/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Customers } from './components/Customers';
import { Products } from './components/Products';
import { Quotes } from './components/Quotes';
import { Settings } from './components/Settings';
import { QuotePrint } from './components/QuotePrint';
import { useAppStore } from './store';
import { Quote } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [printingQuote, setPrintingQuote] = useState<Quote | null>(null);
  const {
    customers,
    setCustomers,
    products,
    setProducts,
    quotes,
    setQuotes,
    company,
    setCompany,
  } = useAppStore();

  if (printingQuote) {
    return (
      <QuotePrint
        quote={printingQuote}
        company={company}
        customer={customers.find((c) => c.id === printingQuote.customerId)}
        onBack={() => setPrintingQuote(null)}
      />
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && (
        <Dashboard
          customers={customers}
          products={products}
          quotes={quotes}
        />
      )}
      {activeTab === 'customers' && (
        <Customers customers={customers} setCustomers={setCustomers} />
      )}
      {activeTab === 'products' && (
        <Products products={products} setProducts={setProducts} />
      )}
      {activeTab === 'quotes' && (
        <Quotes
          quotes={quotes}
          setQuotes={setQuotes}
          customers={customers}
          products={products}
          onPrint={setPrintingQuote}
        />
      )}
      {activeTab === 'settings' && (
        <Settings company={company} setCompany={setCompany} />
      )}
    </Layout>
  );
}
