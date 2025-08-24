const cookie = require('cookie');
const { OAuth } = require('./common/oauth.js');

exports.handler = async (event) => {
  const { code } = event.queryStringParameters;
  const ck = cookie.parse(event.headers.cookie || '');

  if (!ck.provider) {
    return { statusCode: 400, body: 'Provider missing' };
  }
  const referer = ck.referer || '/admin/';

  const oauth = new OAuth(ck.provider);

  try {
    const { token } = await oauth.getToken(code);
    const jwt  = token.access_token;
    const tipo = token.token_type;

    // Entregamos un HTML que:
    // 1) guarda la cookie (SSR/fetch)
    // 2) inyecta sessionStorage + localStorage
    // 3) redirige limpio al admin
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Autenticando…</title></head>
<body>
<script>
  // 1) Cookie para el server
  document.cookie = 'jwt=${jwt}; path=/; max-age=3600; sameSite=lax';

  // 2) Sveltia lee el token desde storage
  sessionStorage.setItem('access_token', '${jwt}');
  sessionStorage.setItem('token_type', '${tipo}');
  localStorage.setItem('access_token', '${jwt}');
  localStorage.setItem('token_type', '${tipo}');

  // 3) Volvemos al admin sin query ni hash
  window.location.replace('${referer}');
</script>
</body></html>
      `
    };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: 'Error en servidor' };
  }
};
