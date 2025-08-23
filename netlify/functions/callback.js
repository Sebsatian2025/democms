// netlify/functions/callback.js
import cookie from 'cookie';
import { OAuth } from './common/oauth.js';

const { SITE_URL = 'https://sebastiandemo.netlify.app' } = process.env;

export const handler = async (event) => {
  const { code } = event.queryStringParameters;
  const { provider, referer } = cookie.parse(event.headers.cookie || '');
  const oauth = new OAuth(provider);

  try {
    // 👇 el getToken necesita pasar un objeto con `code` y `redirect_uri`
    const result = await oauth.getToken(code);
    const { access_token, token_type } = result.token;

    return {
      statusCode: 302,
      headers: {
        Location: `${SITE_URL}/admin/#access_token=${access_token}&token_type=${token_type}`,
        'Cache-Control': 'no-cache',
      },
    };
  } catch (e) {
    console.error('OAuth callback error:', e.message);
    return {
      statusCode: 500,
      body: 'OAuth Server Error',
    };
  }
};
