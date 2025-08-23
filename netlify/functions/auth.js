// netlify/functions/auth.js
import { URLSearchParams } from 'url'

export const handler = async (event) => {
  const { queryStringParameters = {} } = event
  const code = queryStringParameters.code

  // Fase 1: sin code → devolvemos { url }
  if (!code) {
    const params = new URLSearchParams({
      client_id:     process.env.GITHUB_CLIENT_ID,
      redirect_uri:  'https://sebastiandemo.netlify.app/.netlify/functions/auth',
      scope:         queryStringParameters.scope || 'repo',
      state:         Math.random().toString(36).slice(2),
      allow_signup:  'false',
    })
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: `https://github.com/login/oauth/authorize?${params}` }),
    }
  }

  // Fase 2: con code → intercambio por token y devolvemos { token }
  const tokenRes = await fetch(
    'https://github.com/login/oauth/access_token',
    {
      method: 'POST',
      headers: {
        Accept:        'application/json',
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        client_id:     process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri:  'https://sebastiandemo.netlify.app/.netlify/functions/auth',
      }),
    }
  )
  const { access_token, token_type } = await tokenRes.json()

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: { access_token, token_type } }),
  }
}
