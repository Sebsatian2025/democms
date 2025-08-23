// netlify/functions/callback.js
exports.handler = async (event) => {
  const code = event.queryStringParameters?.code
  const host = event.headers.host

  // 1) inicio OAuth
  if (!code) {
    const params = new URLSearchParams({
      client_id:    process.env.GITHUB_CLIENT_ID,
      redirect_uri: `https://${host}/.netlify/functions/callback`,
      scope:        'repo',
      state:        Math.random().toString(36).slice(2),
      allow_signup: 'false',
    })
    return {
      statusCode: 302,
      headers: {
        Location: `https://github.com/login/oauth/authorize?${params}`,
      },
    }
  }

  // 2) intercambio code→token
  const tokenRes = await fetch(
    'https://github.com/login/oauth/access_token',
    {
      method:  'POST',
      headers: { Accept:'application/json', 'Content-Type':'application/json' },
      body:    JSON.stringify({
        client_id:     process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri:  `https://${host}/.netlify/functions/callback`,
      }),
    }
  )
  const { access_token, token_type } = await tokenRes.json()

  // 3) redirijo SOLO A /admin con el token en el hash
  return {
    statusCode: 302,
    headers: {
      Location: `https://${host}/admin#access_token=${access_token}&token_type=${token_type}`,
    },
  }
}
