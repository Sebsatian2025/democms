const cookie = require('cookie');
const { OAuth } = require('./common/oauth.js');

const oauth = new OAuth(process.env.OAUTH_PROVIDER || 'github');

exports.handler = async (event) => {
  // Sveltia no pasa referer, siempre volvemos a /admin/
  const referer = '/admin/';

  // Si ya hay jwt en cookie, devolvemos hash para que Sveltia lo procese
  const headerCookie = event.headers.cookie || '';
  const existing    = headerCookie.match(/jwt=([^;]+)/)?.[1];
  if (existing) {
    return {
      statusCode: 302,
      headers: {
        Location: `${referer}#access_token=${existing}`
      }
    };
  }

  // Iniciamos OAuth
  const scope = 'public_repo read:user';
  const authURL = oauth.getAuthorizationURL(scope);

  // Guardamos provider + referer
  const cookies = [
    cookie.serialize('provider', oauth.provider, {
      httpOnly: true,
      path:     '/',
      maxAge:   3600,
      sameSite: 'lax'
    }),
    cookie.serialize('referer',  referer, {
      httpOnly: true,
      path:     '/',
      maxAge:   3600,
      sameSite: 'lax'
    })
  ];

  return {
    statusCode: 302,
    multiValueHeaders: {
      'Set-Cookie': cookies,
      'Cache-Control': ['no-cache']
    },
    headers: {
      Location: authURL
    }
  };
};
