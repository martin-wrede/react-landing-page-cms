import React from 'react';

const CTASection = ({ data }) => {
  return (
    <section id="cta" className="cta-section">
      <div className="container">
        <h2>{data.headline}</h2>
        {data.subtext && <p className="cta-subtext">{data.subtext}</p>}

        {data.pricingItems ? (
          <div className="pricing-container">
            {data.pricingItems.map((item, index) => (
              <div key={index} className="pricing-card">
                <h3 className="pricing-title">{item.title}</h3>
                <ul className="pricing-features">
                  {item.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                <div className="pricing-price">{item.price}</div>
                <div className="pricing-price-info">{item.priceInformation}</div>
                <a href={item.buttonLink} className="cta-button pricing-button">{item.buttonText}</a>
                {item.secondaryButtonText && (
                  <a
                    href={item.secondaryButtonLink}
                    className="pricing-secondary-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.secondaryButtonText}
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="hero-cta-buttons">
            <a href={data.cta1.link} className="cta-button">{data.cta1.text}</a>
            <a href={data.cta2.link} className="cta-button">{data.cta2.text}</a>
          </div>
        )}
      </div>
    </section>
  );
};

export default CTASection;