import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Component/Header';
import Footer from './Component/Footer';

function Layout() {
  const navigate = useNavigate();
  const openDriverModal = () => navigate('/driver');

  return (
    <div className="min-h-screen flex flex-col">
      <Header onDriverClick={openDriverModal} />
      <main className="flex-1">
        <Outlet context={{ openDriverModal }} />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
