// netlify/functions/callback.js
import cookie from 'cookie';
import { OAuth } from './common/oauth.js';

export const handler = async (event) => {
  const { code } = event.queryStringParameters;
  const { provider, referer } = cookie.parse(event.headers.cookie);
  const oauth = new OAuth(provider);

  try {
    const { token } = await oauth.getToken(code);
    const { access_token, token_type } = token;

    return {
      statusCode: 302,
      headers: {
        Location: `${referer}#access_token=${access_token}&token_type=${token_type}`,
        'Cache-Control': 'no-cache',
      },
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: 'Server Error',
    };
  }
};
