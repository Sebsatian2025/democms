// netlify/functions/auth.js
exports.handler = async (event) => {
  const { rawUrl, httpMethod, queryStringParameters, headers } = event;
  const clientId = process.env.SVELTIA_CLIENT_ID;
  const clientSecret = process.env.SVELTIA_CLIENT_SECRET;
  const host = headers.host;

  // 1) Inicio de OAuth: GET /.netlify/functions/auth
  if (httpMethod === 'GET' && rawUrl.endsWith('/auth')) {
    const redirectUri = `https://${host}/admin`;
    const state = Math.random().toString(36).slice(2);
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'repo',
      state,
      allow_signup: 'false',
    });
    return {
      statusCode: 302,
      headers: {
        Location: `https://github.com/login/oauth/authorize?${params}`,
      },
    };
  }

  // 2) Intercambio de código: GET /.netlify/functions/auth?code=…
  if (httpMethod === 'GET' && queryStringParameters.code) {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: queryStringParameters.code,
      }),
    });
    const { access_token } = await tokenRes.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: access_token }),
    };
  }

  return { statusCode: 404, body: 'Not Found' };
};
