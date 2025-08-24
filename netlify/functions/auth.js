// netlify/functions/auth.js
import cookie from 'cookie';
import { OAuth } from './common/oauth.js';

const { OAUTH_PROVIDER = 'github' } = process.env;

const oauth = new OAuth(OAUTH_PROVIDER);

export const handler = async (event) => {
  const { referer } = event.queryStringParameters;
  
  // Aquí es donde se definen los permisos (scopes)
  const scope = 'repo user';

  const authorizationURL = oauth.getAuthorizationURL(scope);
  
  const refererCookie = cookie.serialize('referer', referer, {
    httpOnly: true,
    path: '/.netlify/functions/callback',
    maxAge: 3600,
  });

  return {
    statusCode: 302,
    headers: {
      'Set-Cookie': refererCookie,
      Location: authorizationURL,
      'Cache-Control': 'no-cache',
    },
  };
};
