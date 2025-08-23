// netlify/functions/auth.js
import cookie from 'cookie';
import { OAuth } from './common/oauth.js';

const { OAUTH_PROVIDER = 'github' } = process.env;

const oauth = new OAuth(OAUTH_PROVIDER);

export const handler = async (event) => {
  const { provider = 'github', scope = 'repo,user', referer = '/' } = event.queryStringParameters;

  // 👇 ahora se genera la URL con redirect_uri dentro de OAuth
  const authorizationURL = oauth.getAuthorizationURL(scope);

  const providerCookie = cookie.serialize('provider', provider, {
    httpOnly: true,
    path: '/.netlify/functions/callback',
    maxAge: 3600,
  });

  const refererCookie = cookie.serialize('referer', referer, {
    httpOnly: true,
    path: '/.netlify/functions/callback',
    maxAge: 3600,
  });

  return {
    statusCode: 302,
    headers: {
      'Set-Cookie': [providerCookie, refererCookie], // 👈 mejor como array
      Location: authorizationURL,
      'Cache-Control': 'no-cache',
    },
  };
};
