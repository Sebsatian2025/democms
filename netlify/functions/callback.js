// netlify/functions/callback.js
const cookie = require('cookie');
const { OAuth } = require('./common/oauth.js');

exports.handler = async (event) => {
  const { code } = event.queryStringParameters;
  const ck = cookie.parse(event.headers.cookie || '');

  // Recuperamos provider y referer de las cookies
  if (!ck.provider) {
    return { statusCode: 400, body: 'Provider missing' };
  }
  const referer = ck.referer || '/admin/';

  const oauth = new OAuth(ck.provider);

  try {
    // 1) Intercambiamos el code por token
    const { token } = await oauth.getToken(code);
    const jwt = token.access_token;
    const tipo = token.token_type;

    // 2) Servimos un HTML que setea cookie + sessionStorage y redirige
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Autenticando…</title></head>
<body>
<script>
  // 2.1) Cookie para SSR o futuras validaciones
  document.cookie = 'jwt=${jwt}; path=/; max-age=3600; sameSite=lax';

  // 2.2) sessionStorage que Sveltia leerá en el front
  sessionStorage.setItem('access_token', '${jwt}');
  sessionStorage.setItem('token_type', '${tipo}');

  // 2.3) Volvemos al referer limpio
  window.location.replace('${referer}');
</script>
</body>
</html>
`
    };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: 'Error en servidor' };
  }
};

