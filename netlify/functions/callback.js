// netlify/functions/callback.js
import { OAuth } from './common/oauth.js'   //  IMPORT NECESARIO

export const handler = async (event) => {
  const params = event.queryStringParameters || {}
  const CALLBACK = process.env.OAUTH_CALLBACK

  // 1) Si no hay "code" en la URL, redirige a GitHub para pedirlo
  if (!params.code) {
    const authorizationURL = new OAuth('github').getAuthorizationURL()
    return {
      statusCode: 302,
      headers: {
        Location: authorizationURL,
        'Cache-Control': 'no-cache',
      },
    }
  }

  // 2) Cuando vuelves con ?code=..., intercambia por token y redirige
  try {
    const result = await new OAuth('github').getToken(params.code, CALLBACK)
    const { access_token, token_type } = result.token

    // Aquí forzamos al /admin de tu CMS, sin undefined ni query params extra
    return {
      statusCode: 302,
      headers: {
        Location: `https://sebastiandemo.netlify.app/admin#access_token=${access_token}&token_type=${token_type}`,
        'Cache-Control': 'no-cache',
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
