// Espera a que CMS esté listo y React exista
(function waitForCMS() {
  if (!window.CMS || typeof window.React === 'undefined') {
    return setTimeout(waitForCMS, 100);
  }

  const CMS = window.CMS;
  const React = window.React;

  // 1) Recupero el control nativo de 'image'
  const imageWidget = CMS.getWidget('image');
  const ImageControl = imageWidget.control;

  // 2) Creo el preview que aplica estilos inline
  function SmallImagePreview({ value }) {
    if (!value) return null;
    return React.createElement('img', {
      src: value,
      style: {
        maxWidth: '200px',
        height: 'auto',
        borderRadius: '6px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        marginBottom: '0.5rem'
      },
      alt: ''
    });
  }

  // 3) Registro mi widget “small-image”
  CMS.registerWidget(
    'small-image',    // nombre de widget en tu config.yml
    ImageControl,     // reutiliza el control de 'image'
    SmallImagePreview // este preview estilizado
  );
})();
