// netlify/functions/callback.js
import cookie from 'cookie'
import { OAuth } from './common/oauth.js'      //  Esto faltaba

export const handler = async (event) => {
  const params = event.queryStringParameters || {}
  const cookies = cookie.parse(event.headers.cookie || '')
  const referer = cookies.referer || '/admin'
  const CALLBACK = process.env.OAUTH_CALLBACK

  // 1) Si no hay code, redirijo a GitHub
  if (!params.code) {
    const authorizationURL = new OAuth('github')
      .getAuthorizationURL(params.scope)
    return {
      statusCode: 302,
      headers: {
        'Cache-Control': 'no-cache',
        'Set-Cookie': cookie.serialize('referer', referer, {
          httpOnly: true,
          path: '/',
          maxAge: 3600,
        }),
        Location: authorizationURL,
      },
    }
  }

  // 2) Cuando GitHub responde con ?code=…, intercambio por token
  try {
    const oauth = new OAuth('github')
    const result = await oauth.getToken(params.code, CALLBACK)
    const { access_token, token_type } = result.token

    return {
      statusCode: 302,
      headers: {
        'Cache-Control': 'no-cache',
        Location: `https://sebastiandemo.netlify.app${referer}#access_token=${access_token}&token_type=${token_type}`,
      },
    }
  } catch (e) {
    console.error('OAuth callback error:', e)
    return {
      statusCode: 500,
      body: `OAuth Error: ${e.message}`,
    }
  }
}
