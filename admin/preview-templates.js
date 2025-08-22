function PortfolioPreview({ entry }) {
  const keys = [
    'portfolio_img_1',
    'portfolio_img_2',
    'portfolio_img_3',
    'portfolio_img_4'
  ];

  const images = keys
    .map(key => entry.getIn(['data', key]))
    .filter(Boolean);

  const items = images.map((src, i) =>
    React.createElement('div', { key: i, className: 'col-6 mb-4' },
      React.createElement('div', { className: 'portfolio-item' },
        React.createElement('img', {
          src,
          style: {
            width: '100%',
            objectFit: 'cover',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }
        })
      )
    )
  );

  return React.createElement('div', { className: 'row' }, items);
}

// Esperamos a que CMS esté disponible
window.addEventListener('load', () => {
  if (window.CMS) {
    window.CMS.registerPreviewTemplate('portfolio', PortfolioPreview);
    console.log("✅ PortfolioPreview registrado");
  } else {
    console.warn("⚠️ CMS no está disponible aún");
  }
});
