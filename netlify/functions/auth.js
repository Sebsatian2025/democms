// netlify/functions/auth.js
import cookie from 'cookie';
import { OAuth } from './common/oauth.js';

const { OAUTH_PROVIDER = 'github' } = process.env;
const oauth = new OAuth(OAUTH_PROVIDER);

export const handler = async (event) => {
  const { referer = '/' } = event.queryStringParameters;

  // Definimos los permisos que necesitamos
  const scope = 'repo read:user';

  // Generamos la URL de autorización de GitHub
  const authorizationURL = oauth.getAuthorizationURL(scope);

  // Guardamos la cookie con el provider correcto
  const providerCookie = cookie.serialize('provider', OAUTH_PROVIDER, {
    httpOnly: true,
    path: '/.netlify/functions/callback',
    maxAge: 3600, // 1 hora
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

