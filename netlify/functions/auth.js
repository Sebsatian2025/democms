// netlify/functions/auth.js
const cookie = require('cookie');
const { OAuth } = require('./common/oauth.js');
const oauth = new OAuth(process.env.OAUTH_PROVIDER || 'github');

exports.handler = async (event) => {
  // Sveltia pasa provider, site_id, scope y redirect_uri
  const redirectUri = event.queryStringParameters.redirect_uri || '/admin/';

  // Si ya hay token, reenvío con hash
  const existing = event.headers.cookie?.match(/jwt=([^;]+)/)?.[1];
  if (existing) {
    return {
      statusCode: 302,
      headers: {
        Location: `${redirectUri}#access_token=${existing}`
      }
    };
  }

  // Lanzamos OAuth y guardamos provider + redirect_uri en cookie
  const scope = 'public_repo read:user';
  const authURL = oauth.getAuthorizationURL(scope);

  const cookies = [
    cookie.serialize('provider', oauth.provider, {
      httpOnly: true, path: '/', maxAge: 3600, sameSite: 'lax'
    }),
    cookie.serialize('redirect_uri', redirectUri, {
      httpOnly: true, path: '/', maxAge: 3600, sameSite: 'lax'
    })
  ];

  return {
    statusCode: 302,
    multiValueHeaders: { 'Set-Cookie': cookies, 'Cache-Control': ['no-cache'] },
    headers: { Location: authURL }
  };
};
