// netlify/functions/callback.js
import cookie from 'cookie'
import { OAuth } from './common/oauth.js'

const { OAUTH_CALLBACK } = process.env

export const handler = async (event) => {
  const params = event.queryStringParameters || {}
  const cookies = cookie.parse(event.headers.cookie || '')
  const referer = cookies.referer || '/admin'

  // 1) Paso inicial: redirigir a GitHub si no hay code
  if (!params.code) {
    const authorizationURL = new OAuth('github').getAuthorizationURL(params.scope)
    const setCookie = cookie.serialize('referer', referer, {
      httpOnly: true,
      path: '/',            // que esté disponible en toda la app
      maxAge: 3600,
    })
    return {
      statusCode: 302,
      headers: {
        'Cache-Control': 'no-cache',
        'Set-Cookie': setCookie,
        Location: authorizationURL,
      },
    }
  }

  // 2) Callback: intercambiar `code` por token y redirigir al admin
  try {
    // asegúrate de tener este método en tu clase OAuth:
    //    async getToken(code, redirect_uri) { ... }
    const result = await new OAuth('github').getToken(params.code, OAUTH_CALLBACK)
    const { access_token, token_type } = result.token

    return {
      statusCode: 302,
      headers: {
        'Cache-Control': 'no-cache',
        Location: `${OAUTH_CALLBACK.replace(/\/\.netlify\/functions\/callback$/, '')}${referer}#access_token=${access_token}&token_type=${token_type}`
      },
    }
  } catch (e) {
    console.error('OAuth callback error:', e)
    return { statusCode: 500, body: `OAuth Error: ${e.message}` }
  }
}
