// netlify/functions/auth.js
const cookie = require('cookie');
const { OAuth } = require('./common/oauth.js');
const oauth = new OAuth(process.env.OAUTH_PROVIDER || 'github');

exports.handler = async (event) => {
  // Sveltia siempre manda redirect_uri
  const redirectUri = event.queryStringParameters.redirect_uri || '/admin/';

  // Generamos la URL de GitHub y guardamos provider + redirect_uri
  const authURL = oauth.getAuthorizationURL('public_repo read:user');
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
    multiValueHeaders: {
      'Set-Cookie': cookies,
      'Cache-Control': ['no-cache']
    },
    headers: {
      Location: authURL
    }
  };
};
