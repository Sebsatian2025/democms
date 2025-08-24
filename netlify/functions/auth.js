// netlify/functions/auth.js
import cookie from 'cookie';
import { OAuth } from './common/oauth.js';

const { OAUTH_PROVIDER = 'github' } = process.env;
const oauth = new OAuth(OAUTH_PROVIDER);

export const handler = async (event) => {
  const { referer = '/' } = event.queryStringParameters;
  const scope = 'public_repo read:user';
  const authorizationURL = oauth.getAuthorizationURL(scope);

  const providerCookie = cookie.serialize('provider', OAUTH_PROVIDER, {
    httpOnly: true,
    path: '/',
    maxAge: 3600,
  });

  return {
    statusCode: 302,
    headers: { 'Set-Cookie': providerCookie, Location: authorizationURL, 'Cache-Control': 'no-cache' },
  };
};
