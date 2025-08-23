// netlify/functions/auth.js
import cookie from 'cookie';
import { OAuth } from './common/oauth.js';

const { OAUTH_PROVIDER = 'github' } = process.env;
const oauth = new OAuth(OAUTH_PROVIDER);

export const handler = async (event) => {
  const { provider, scope, referer } = event.queryStringParameters;
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
      'Set-Cookie': [providerCookie, refererCookie],
      Location: authorizationURL,
      'Cache-Control': 'no-cache',
    },
  };
};
