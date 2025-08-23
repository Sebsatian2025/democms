// netlify/functions/auth.js
import { URLSearchParams } from 'url'
import fetch from 'node-fetch'     // Node 18+ puede usar global fetch, si da error instala node-fetch

export const handler = async (event) => {
  const code = event.queryStringParameters?.code || ''
  const host = event.headers.host

  // 1) Sin code: devolvemos un JSON con la URL de autorización
  if (!code) {
    const redirect_uri = `https://${host}/.netlify/functions/auth`
    const params = new URLSearchParams({
      client_id:     process.env.GITHUB_CLIENT_ID,
      redirect_uri,
      scope:         'repo',
      state:         Math.random().toString(36).slice(2),
      allow_signup:  'false',
    })
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authorization_url: `https://github.com/login/oauth/authorize?${params}`,
      }),
    }
  }

  // 2) Con code: intercambiamos por token y devolvemos JSON
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
        redirect_uri:  `https://${host}/.netlify/functions/auth`,
      }),
    }
  )
  const { access_token, token_type } = await tokenRes.json()

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: { access_token, token_type },
    }),
  }
}
