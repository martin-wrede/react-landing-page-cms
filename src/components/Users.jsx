import React from 'react';

const Users = ({ data }) => {
  return (
    <section className="features">
      <div className="container">
        <h2>{data.title}</h2>
        {data.items.map((user, index) => (
          <div key={index} className="feature-item">
            <div className="feature-text">
              <h3>{user.title}</h3>
              <p>{user.description}</p>
            </div>
            <div className="feature-image-container">
              <img src={import.meta.env.BASE_URL + user.imageUrl} alt={user.title} className="feature-image" />
              {user.aiLabel && <p className="ai-label">{user.aiLabel}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Users;