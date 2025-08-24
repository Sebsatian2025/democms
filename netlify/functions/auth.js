// netlify/functions/auth.js
const cookie = require('cookie');
const { OAuth } = require('./common/oauth.js');

const oauth = new OAuth(process.env.OAUTH_PROVIDER || 'github');

exports.handler = async (event) => {
  const headerCookie = event.headers.cookie || '';
  const tokenCookie  = headerCookie.match(/jwt=([^;]+)/)?.[1];
  if (tokenCookie) {
    return {
      statusCode: 302,
      headers: { Location: `/admin/#access_token=${tokenCookie}` }
    };
  }

  const scope = 'public_repo read:user';
  const authorizationURL = oauth.getAuthorizationURL(scope);

  const providerCookie = cookie.serialize('provider', oauth.provider, {
    httpOnly: true,
    path:     '/',
    maxAge:   3600,
    sameSite: 'lax'
  });

  return {
    statusCode: 302,
    headers: {
      'Set-Cookie':   providerCookie,
      Location:       authorizationURL,
      'Cache-Control': 'no-cache'
    }
  };
};

