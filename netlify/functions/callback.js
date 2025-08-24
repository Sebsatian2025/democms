// netlify/functions/callback.js
const cookie = require('cookie');
const { OAuth } = require('./common/oauth.js');

exports.handler = async (event) => {
  const { code } = event.queryStringParameters;
  const ck = cookie.parse(event.headers.cookie || '');

  if (!ck.provider) {
    return { statusCode: 400, body: 'Provider missing' };
  }
  const redirectUri = ck.redirect_uri || '/admin/';

  const oauth = new OAuth(ck.provider);

  try {
    const { token } = await oauth.getToken(code);
    const jwt  = token.access_token;
    const tipo = token.token_type;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Autenticando…</title></head>
<body>
<script>
  // 1) Guarda cookie para fetch/SSR
  document.cookie = 'jwt=${jwt}; path=/; max-age=3600; sameSite=lax';

  // 2) Función para inyectar el token en una ventana dada
  function setToken(win) {
    win.sessionStorage.setItem('access_token', '${jwt}');
    win.sessionStorage.setItem('token_type', '${tipo}');
    win.localStorage.setItem('access_token', '${jwt}');
    win.localStorage.setItem('token_type', '${tipo}');
  }

  // 3) Si estamos en un popup, comunicamos al padre y cerramos el popup
  if (window.opener && !window.opener.closed) {
    setToken(window.opener);
    window.opener.location.replace('${redirectUri}#access_token=${jwt}');
    window.close();
  } else {
    // Fallback si no hay opener
    setToken(window);
    window.location.replace('${redirectUri}#access_token=${jwt}');
  }
</script>
</body></html>
      `
    };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: 'Server Error' };
  }
};
