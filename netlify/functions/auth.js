// netlify/functions/auth.js
import { URLSearchParams } from 'url'

exports.handler = async (event) => {
  const { queryStringParameters, headers } = event
  const code  = queryStringParameters?.code
  const host  = headers.host
  const redirect_uri = `https://${host}/.netlify/functions/auth`

  // 1) Sin code: devolvemos { url }
  if (!code) {
    const params = new URLSearchParams({
      client_id:     process.env.GITHUB_CLIENT_ID,
      redirect_uri,
      scope:         queryStringParameters.scope || 'repo',
      state:         Math.random().toString(36).slice(2),
      allow_signup:  'false',
    })
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // *** Clave EXACTA que Sveltia espera ***
        url: `https://github.com/login/oauth/authorize?${params.toString()}`,
      }),
    }
  }

  // 2) Con code: intercambiamos por token y devolvemos { token }
  const tokenRes = await fetch(
    'https://github.com/login/oauth/access_token',
    {
      method:  'POST',
      headers: {
        Accept:        'application/json',
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        client_id:     process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri,
      }),
    }
  )
  const { access_token, token_type } = await tokenRes.json()

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // *** Clave EXACTA que Sveltia espera ***
      token: { access_token, token_type },
    }),
  }
}
