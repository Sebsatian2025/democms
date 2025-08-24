// netlify/functions/auth.js
import cookie from 'cookie';
import { OAuth } from './common/oauth.js';

const { OAUTH_PROVIDER = 'github' } = process.env;
const oauth = new OAuth(OAUTH_PROVIDER);

export const handler = async (event) => {
  // Revisar si ya hay jwt en la cookie para no reiniciar OAuth
  const tokenCookie = event.headers.cookie?.match(/jwt=([^;]+)/)?.[1];
  if (tokenCookie) {
    return {
      statusCode: 302,
      headers: {
        Location: `/admin/#access_token=${tokenCookie}`,
        'Cache-Control': 'no-cache',
      },
    };
  }

  const { referer = '/' } = event.queryStringParameters;

  // Permisos requeridos
  const scope = 'public_repo read:user';

  // Generar URL de autorización de GitHub
  const authorizationURL = oauth.getAuthorizationURL(scope);

  // Guardar cookie del provider para luego recuperar en callback
  const providerCookie = cookie.serialize('provider', OAUTH_PROVIDER, {
    httpOnly: true,
    path: '/',
    maxAge: 3600,
    sameSite: 'lax'
  });

  return {
    statusCode: 302,
    headers: {
      'Set-Cookie': providerCookie,
      Location: authorizationURL,
      'Cache-Control': 'no-cache',
    },
  };
};
