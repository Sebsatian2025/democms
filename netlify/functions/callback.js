// netlify/functions/callback.js
import cookie from 'cookie';
import { OAuth } from './common/oauth.js';

export const handler = async (event) => {
  const { code } = event.queryStringParameters;

  // Leemos la cookie del provider
  const { provider } = cookie.parse(event.headers.cookie || '');
  if (!provider) {
    return {
      statusCode: 400,
      body: 'Provider not found in cookie',
    };
  }

  const oauth = new OAuth(provider);

  try {
    // Obtenemos el token de GitHub usando el código recibido
    const { token } = await oauth.getToken(code);
    const { access_token, token_type } = token;

    // Redirigimos al admin de Sveltia con el token
    return {
      statusCode: 302,
      headers: {
        Location: `/admin/#access_token=${access_token}&token_type=${token_type}`,
        'Cache-Control': 'no-cache',
      },
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: 'Server Error',
    };
  }
};
