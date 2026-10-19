import React from 'react';

const FAQ = ({ data }) => {
  return (
    <section className="faq">
      <div className="container">
        <h2>{data.title}</h2>
        <div className="faq-list">
          {data.items.map((item, index) => (
            <div key={index} className="faq-item">
              <h4>{item.question}</h4>
              {/* A newline in the JSON becomes a new paragraph */}
              {item.answer.split('\n').filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              {item.imageUrl && <img src={item.imageUrl} alt="Info-Graphic" width="100%" height="auto" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;