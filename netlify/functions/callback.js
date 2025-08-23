// netlify/functions/callback.js

exports.handler = async (event) => {
  const code = event.queryStringParameters?.code
  const host = event.headers.host
  const redirectUri = `https://${host}/.netlify/functions/callback`

  // 1) Sin ?code → arrancamos OAuth
  if (!code) {
    const state  = Math.random().toString(36).slice(2)
    const params = new URLSearchParams({
      client_id:    process.env.GITHUB_CLIENT_ID,
      redirect_uri: redirectUri,
      scope:        'repo',
      state,
      allow_signup: 'false',
    })
    return {
      statusCode: 302,
      headers: {
        Location: `https://github.com/login/oauth/authorize?${params.toString()}`,
      },
    }
  }

  // 2) Con ?code → intercambiamos por token y redirigimos al admin
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
        redirect_uri:  redirectUri,
      }),
    }
  )
  const { access_token, token_type } = await tokenRes.json()

  return {
    statusCode: 302,
    headers: {
      Location: `https://${host}/admin#access_token=${access_token}&token_type=${token_type}`,
    },
  }
}
