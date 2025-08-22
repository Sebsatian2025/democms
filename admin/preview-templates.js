const { registerPreviewTemplate } = window.CMS;

function PortfolioPreview({ entry }) {
  // Extraemos las 4 rutas de imagen
  const imgs = [1,2,3,4]
    .map(i => entry.getIn(['data', `portfolio_img_${i}`]))
    .filter(Boolean);

  // Estructura simple: sección con título + grid 2x2
  return React.createElement(
    'section',
    { id: 'portfolio', style: { padding: '1rem' } },
    React.createElement('h3', { style: { textAlign: 'center', color: '#6c757d', margin: '0.5rem 0' } }, 'Portfolio'),
    React.createElement('h2', { style: { textAlign: 'center', marginBottom: '1.5rem' } }, 'Recent Projects'),
    React.createElement(
      'div',
      {
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          maxWidth: '800px',
          margin: '0 auto'
        }
      },
      imgs.map((src, idx) =>
        React.createElement('img', {
          key: idx,
          src,
          style: {
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '4px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
          }
        })
      )
    )
  );
}

registerPreviewTemplate('portfolio', PortfolioPreview);
console.log('✅ Preview ligero de Portfolio registrado');
