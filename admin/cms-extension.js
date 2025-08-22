// File: cms-extension.js
(function() {
  // Define the styles you want to apply to each thumbnail
  const styleProps = {
    maxWidth: '200px',
    height: 'auto',
    borderRadius: '6px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    marginBottom: '0.5rem'
  };

  // Apply styles to all current thumbnails
  function styleAllThumbnails() {
    document.querySelectorAll('img[role="presentation"]').forEach(img => {
      if (img.getAttribute('data-cms-styled') !== 'true') {
        Object.assign(img.style, styleProps);
        img.setAttribute('data-cms-styled', 'true');
      }
    });
  }

  // Initialize: style existing nodes and observe for new ones
  function initThumbnailStyler() {
    styleAllThumbnails();
    new MutationObserver(styleAllThumbnails)
      .observe(document.body, { childList: true, subtree: true });
  }

  // Wait for Decap CMS to load before starting the styler
  function waitForCMS() {
    if (window.CMS) {
      initThumbnailStyler();
    } else {
      setTimeout(waitForCMS, 200);
    }
  }

  waitForCMS();
})();
```
