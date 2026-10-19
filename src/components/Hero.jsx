import React from 'react';

const Hero = ({ data }) => {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${import.meta.env.BASE_URL + data.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="hero-overlay">
        <div className="container">
          <h1>{data.headline}</h1>
          <p className="subheadline">{data.subheadline}</p>
          <div className="hero-cta-buttons">
            <a href={data.cta1.link} className="cta-button">{data.cta1.text}</a>
            <a href={data.cta2.link} target="_blank" className="cta-button2">{data.cta2.text}</a>

          </div>
        </div>
      </div>
      {data.aiLabel && <p className="ai-label ai-label--hero">{data.aiLabel}</p>}
    </section>
  );
};

export default Hero;