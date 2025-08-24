// netlify/functions/auth.js
const cookie = require('cookie');
const { OAuth } = require('./common/oauth.js');

const oauth = new OAuth(process.env.OAUTH_PROVIDER || 'github');

exports.handler = async (event) => {
  const referer     = event.queryStringParameters?.referer || '/admin/';
  const headerCookie = event.headers.cookie || '';
  const existing    = headerCookie.match(/jwt=([^;]+)/)?.[1];
  if (existing) {
    return {
      statusCode: 302,
      headers: { Location: referer },
    };
  }

  const scope = 'public_repo read:user';
  const authURL = oauth.getAuthorizationURL(scope);

  // Preparamos cada cookie como string independiente
  const cookies = [
    cookie.serialize('provider', oauth.provider, {
      httpOnly:  true,
      path:      '/',
      maxAge:    3600,
      sameSite:  'lax'
    }),
    cookie.serialize('referer', referer, {
      httpOnly:  true,
      path:      '/',
      maxAge:    3600,
      sameSite:  'lax'
    }),
  ];

  return {
    statusCode: 302,
    // Doble-value headers permite listas
    multiValueHeaders: {
      'Set-Cookie': cookies,
      'Cache-Control': ['no-cache']
    },
    headers: {
      Location: authURL
    }
  };
};
