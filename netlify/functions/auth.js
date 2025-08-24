// netlify/functions/auth.js
const cookie = require('cookie');
const { OAuth } = require('./common/oauth.js');

const oauth = new OAuth(process.env.OAUTH_PROVIDER || 'github');

exports.handler = async (event) => {
  // 1) Capturamos el referer que Sveltia pone en ?referer=…
  const referer = event.queryStringParameters?.referer || '/admin/';

  // 2) Si ya hay jwt, vamos directo
  const existing = event.headers.cookie?.match(/jwt=([^;]+)/)?.[1];
  if (existing) {
    return {
      statusCode: 302,
      headers: {
        Location: referer
      }
    };
  }

  // 3) Arrancamos OAuth y guardamos provider + referer en cookies
  const scope = 'public_repo read:user';
  const authURL = oauth.getAuthorizationURL(scope);

  const cookies = [
    cookie.serialize('provider', oauth.provider, {
      httpOnly: true, path: '/', maxAge: 3600, sameSite: 'lax'
    }),
    cookie.serialize('referer', referer, {
      httpOnly: true, path: '/', maxAge: 3600, sameSite: 'lax'
    })
  ];

  return {
    statusCode: 302,
    headers: {
      'Set-Cookie': cookies,
      Location:    authURL,
      'Cache-Control': 'no-cache'
    }
  };
};

