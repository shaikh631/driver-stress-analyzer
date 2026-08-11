import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Component/Header';
import Footer from './Component/Footer';
import DriverAccessModal from './pages/DriverAccessModal';

function Layout() {
  const [driverModalOpen, setDriverModalOpen] = useState(false);
  const navigate = useNavigate();

  const openDriverModal = () => setDriverModalOpen(true);

  const handleDriverVerified = () => {
    setDriverModalOpen(false);
    navigate('/driver');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onDriverClick={openDriverModal} />
      <main className="flex-1">
        <Outlet context={{ openDriverModal }} />
      </main>
      <Footer />
      <DriverAccessModal
        isOpen={driverModalOpen}
        onClose={() => setDriverModalOpen(false)}
        onSuccess={handleDriverVerified}
      />
    </div>
  );
}

export default Layout;
