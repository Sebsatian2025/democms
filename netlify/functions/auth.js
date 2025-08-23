// netlify/functions/auth.js
exports.handler = async (event) => {
  const { headers, rawUrl, queryStringParameters } = event
  const host = headers.host
  const redirectUri = `https://${host}/.netlify/functions/auth`
  const code = queryStringParameters?.code

  // 1) Si no hay código, redirijo al endpoint de autorización de GitHub
  if (!code) {
    const state = Math.random().toString(36).substring(2)
    const params = new URLSearchParams({
      client_id:     process.env.GITHUB_CLIENT_ID,
      redirect_uri:  redirectUri,
      scope:         'repo',
      state,
      allow_signup:  'false',
    })
    return {
      statusCode: 302,
      headers: {
        Location: `https://github.com/login/oauth/authorize?${params.toString()}`,
      },
    }
  }

  // 2) Si viene con ?code=…, intercambio ese código por un access_token
  const tokenRes = await fetch(
    'https://github.com/login/oauth/access_token',
    {
      method: 'POST',
      headers: {
        Accept:       'application/json',
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

  // 3) Redirijo limpio al panel /admin con el token en el hash
  return {
    statusCode: 302,
    headers: {
      Location: `https://${host}/admin#access_token=${access_token}&token_type=${token_type}`,
    },
  }
}
