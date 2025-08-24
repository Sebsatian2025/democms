// netlify/functions/callback.js
const cookie = require('cookie');
const { OAuth } = require('./common/oauth.js');

exports.handler = async (event) => {
  const code = event.queryStringParameters.code;
  const cookies = cookie.parse(event.headers.cookie || '');
  const provider = cookies.provider;
  if (!provider) {
    return { statusCode: 400, body: 'Provider not found in cookie' };
  }

  const oauth = new OAuth(provider);

  try {
    const result = await oauth.getToken(code);
    const access_token = result.token.access_token;
    const token_type   = result.token.token_type;

    const tokenCookie = cookie.serialize('jwt', access_token, {
      httpOnly: false,
      path:     '/',
      maxAge:   3600,
      sameSite: 'lax'
    });

    return {
      statusCode: 302,
      headers: {
        'Set-Cookie':    tokenCookie,
        Location:        `/admin/#access_token=${access_token}&token_type=${token_type}`,
        'Cache-Control': 'no-cache'
      }
    };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: 'Server Error' };
  }
};
