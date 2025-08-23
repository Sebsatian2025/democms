// netlify/functions/callback.js
import { OAuth } from './common/oauth.js'

export const handler = async (event) => {
  const code = event.queryStringParameters?.code

  // 1) Sin “code” arrancamos el flujo OAuth
  if (!code) {
    const authorizationURL = new OAuth('github').getAuthorizationURL()
    return {
      statusCode: 302,
      headers: {
        Location: authorizationURL,
        'Cache-Control': 'no-cache',
      },
    }
  }

  // 2) Con “code” intercambiamos por token y redirigimos sin query params
  try {
    const result = await new OAuth('github').getToken(
      code,
      process.env.OAUTH_CALLBACK
    )
    const { access_token, token_type } = result.token

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
