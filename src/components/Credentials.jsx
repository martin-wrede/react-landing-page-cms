import React from 'react';

const Credentials = ({ data }) => {
  return (
    <section className="credentials">
      <div className="container">
        {data.title && <h3 className="credentials-title">{data.title}</h3>}
        <div className="logos-container">
          {data.logos.map((item, index) => (
            <div key={index} className="credential-item">
              <img
                src={import.meta.env.BASE_URL + item.url}
                width="64"
                height="64"
                alt=""
                className="benefit-icon"
              />
              <h4 className="credential-name">{item.name}</h4>
              {(item.description || item.quote) && (
                <p className="credential-text">{item.description || item.quote}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Credentials;
