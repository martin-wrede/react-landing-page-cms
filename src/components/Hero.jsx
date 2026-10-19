import React, { useState } from 'react';

// Shows the hero video if videoUrl is set, otherwise the screenshot, otherwise nothing.
// If the file fails to load, the element is hidden so the buttons move up.
const HeroMedia = ({ data }) => {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  if (data.videoUrl) {
    return (
      <video
        src={import.meta.env.BASE_URL + data.videoUrl}
        className="hero-media"
        controls
        playsInline
        preload="metadata"
        aria-label={data.videoAlt}
        onError={() => setFailed(true)}
      />
    );
  }

  if (data.screenshotUrl) {
    return (
      <img
        src={import.meta.env.BASE_URL + data.screenshotUrl}
        alt={data.screenshotAlt}
        className="hero-media"
        onError={() => setFailed(true)}
      />
    );
  }

  return null;
};

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
          <HeroMedia key={data.videoUrl || data.screenshotUrl} data={data} />
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
