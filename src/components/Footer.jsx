import React from 'react';

const Footer = ({ data }) => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <p>{data.copyright}</p>
        <div className="footer-links">
          {data.links.map((link, index) => {
            // Absolute URLs, mailto: and anchors pass through untouched;
            // local pages get the deployment base path prefixed.
            const isExternal = /^(https?:|mailto:|#)/.test(link.link);
            const href = isExternal ? link.link : import.meta.env.BASE_URL + link.link;
            return <a key={index} href={href}>{link.text}</a>;
          })}
        </div>
                
      </div>
    </footer>
  );
};

export default Footer;