import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import PoliticianProfile from './pages/PoliticianProfile.jsx';

export default function App() {
  const [selectedPolitician, setSelectedPolitician] = useState(null);

  // Sincroniza com hash da URL para navegação fluida e suporte ao botão Voltar do navegador
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash || hash === '#' || hash === '#home') {
        setSelectedPolitician(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectPolitician = (pol: any) => {
    setSelectedPolitician(pol);
    window.location.hash = `#politico-${pol.casa === 'Senado Federal' ? 'senado' : 'camara'}-${pol.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setSelectedPolitician(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header onGoHome={handleGoHome} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {selectedPolitician ? (
          <PoliticianProfile
            politician={selectedPolitician}
            onBack={handleGoHome}
          />
        ) : (
          <Home onSelectPolitician={handleSelectPolitician} />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
