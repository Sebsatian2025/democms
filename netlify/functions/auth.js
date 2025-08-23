// netlify/functions/auth.js
const fetch = require('node-fetch')

exports.handler = async (event) => {
  const clientId = process.env.SVELTIA_CLIENT_ID
  const clientSecret = process.env.SVELTIA_CLIENT_SECRET
  const host = event.headers.host

  // 1) Iniciar OAuth (GET /auth)
  if (event.rawUrl.endsWith('/auth') && event.httpMethod === 'GET') {
    const redirectUri = `https://${host}/admin`
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'repo',
      state: Math.random().toString(36).slice(2),
      allow_signup: 'false'
    })
    return {
      statusCode: 302,
      headers: { Location: `https://github.com/login/oauth/authorize?${params}` }
    }
  }

  // 2) Intercambiar código por token (GET /auth?code=…)
  if (event.rawUrl.includes('code=') && event.httpMethod === 'GET') {
    const url = 'https://github.com/login/oauth/access_token'
    const body = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: event.queryStringParameters.code
    })
    const res = await fetch(url, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body
    })
    const json = await res.json()
    return {
      statusCode: 200,
      body: JSON.stringify({ token: json.access_token })
    }
  }

  return { statusCode: 404, body: 'Not found' }
}
