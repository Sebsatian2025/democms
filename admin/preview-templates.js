const { registerPreviewTemplate } = window.CMS;

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

  const cards = images.map((src, i) =>
    React.createElement('div', { key: i, className: 'col-md-6 mb-4' },
      React.createElement('div', { className: 'card shadow-sm' },
        React.createElement('img', {
          src,
          className: 'card-img-top',
          style: { objectFit: 'cover', height: '250px' }
        }),
        React.createElement('div', { className: 'card-body' },
          React.createElement('p', { className: 'card-text' }, `Imagen ${i + 1}`)
        )
      )
    )
  );

  return React.createElement('div', { className: 'container' },
    React.createElement('h2', { className: 'mb-4' }, 'Vista previa del portfolio'),
    React.createElement('div', { className: 'row' }, cards)
  );
}

registerPreviewTemplate('portfolio', PortfolioPreview);
console.log('✅ PortfolioPreview registrado');
