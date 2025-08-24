const cookie = require('cookie')
const { OAuth } = require('./common/oauth.js')

exports.handler = async (event) => {
  const { code } = event.queryStringParameters
  const ck = cookie.parse(event.headers.cookie || '')

  if (!ck.provider || !ck.redirectUri) {
    return { statusCode: 400, body: 'Missing session cookies' }
  }

  const oauth = new OAuth(ck.provider)

  try {
    // intercambio code → token
    const { token } = await oauth.getToken(code)
    const jwt  = token.access_token
    const tipo = token.token_type

    // devolvemos un HTML mínimo que envía postMessage al padre y cierra el popup
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Autenticando…</title></head><body>
<script>
  // armamos el payload que Sveltia espera
  const payload = {
    provider: "${ck.provider}",
    token: "${jwt}",
    token_type: "${tipo}"
  };

  // enviamos al opener (la ventana que abrió el popup)
  window.opener.postMessage(payload, window.location.origin);

  // cerramos el popup
  window.close();
</script>
</body></html>
      `
    }
  } catch (e) {
    console.error(e)
    return { statusCode: 500, body: 'Error exchanging token' }
  }
}
