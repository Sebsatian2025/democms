import cookie from 'cookie';
import { OAuth } from './common/oauth.js';

const oauth = new OAuth('github');

export const handler = async (event) => {
  const { scope, referer } = event.queryStringParameters;
  const authorizationURL = oauth.getAuthorizationURL(scope);

  const cookies = [
    cookie.serialize('referer', referer, {
      httpOnly: true,
      path: '/.netlify/functions/callback',
      maxAge: 3600,
    }),
  ];

  return {
    statusCode: 302,
    headers: {
      'Set-Cookie': cookies.join(', '),
      Location: authorizationURL,
      'Cache-Control': 'no-cache',
    },
  };
};
