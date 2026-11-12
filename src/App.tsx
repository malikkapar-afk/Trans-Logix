/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LogisticsProvider, useLogistics } from './context/LogisticsContext';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { OrderCreationView } from './components/OrderCreation/OrderCreationView';
import { CargoTrackerView } from './components/Tracking/CargoTrackerView';
import { PaymentPortalView } from './components/Payment/PaymentPortalView';
import { CallCenterView } from './components/CallCenter/CallCenterView';
import { RegistrationPortalView } from './components/Portal/RegistrationPortalView';
import { VoipCallModal } from './components/CallCenter/VoipCallModal';
import { FloatingCallWidget } from './components/CallCenter/FloatingCallWidget';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('order');
  const { toastMessage, setActiveTrackingCode, setSelectedOrderForPayment, orders } = useLogistics();

  const handleOrderCreated = (orderId: string) => {
    setActiveTrackingCode(orderId);
    setActiveTab('tracking');
  };

  const handleGoToPayment = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrderForPayment(order);
    }
    setActiveTab('payments');
  };

  const handleGoToTracking = (orderId: string) => {
    setActiveTrackingCode(orderId);
    setActiveTab('tracking');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Navigation Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'order' && (
          <OrderCreationView
            onOrderCreated={handleOrderCreated}
            onGoToPayment={handleGoToPayment}
          />
        )}

        {activeTab === 'tracking' && (
          <CargoTrackerView onGoToPayment={handleGoToPayment} />
        )}

        {activeTab === 'payments' && (
          <PaymentPortalView onGoToTracking={handleGoToTracking} />
        )}

        {activeTab === 'callcenter' && (
          <CallCenterView />
        )}

        {activeTab === 'portal' && (
          <RegistrationPortalView
            onGoToOrder={() => setActiveTab('order')}
            onGoToTracking={handleGoToTracking}
          />
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* VoIP Call Overlay & Intercom Modal */}
      <VoipCallModal />

      {/* Floating 24/7 Hotline & Emergency SOS Widget */}
      <FloatingCallWidget />

      {/* Global Interactive Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-slate-900/95 border border-amber-500/60 text-white text-xs font-semibold shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <LogisticsProvider>
      <MainAppContent />
    </LogisticsProvider>
  );
}
