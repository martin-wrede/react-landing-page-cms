
import React, { useState, useContext } from 'react';
import './App.css';

// Import context
import { Context } from './Context';

// Import components
import Header from './components/Header';
import Hero from './components/Hero';
import Credentials from './components/Credentials';
import CTASection from './components/CTASection';
import Features from './components/Features';
import Users from './components/Users';
import FAQ from './components/FAQ';

import Footer from './components/Footer';

function App() {
  const { data } = useContext(Context);
  const [showFAQ, setShowFAQ] = useState(true);

  // Don't render until data is loaded
  if (!data || Object.keys(data).length === 0) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="App">
      <Header data={data.header} />

      <main>
        <Hero data={data.hero} />
        <Credentials data={data.credentials} />
        <Features data={data.features} />
        <Users data={data.users} />

        {showFAQ && <FAQ data={data.faq} />}

        <CTASection data={data.ctaSection} />
      </main>

      <Footer data={data.footer} />
    </div>
  );
}

export default App;