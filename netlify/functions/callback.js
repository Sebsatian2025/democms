// netlify/functions/callback.js
import cookie from 'cookie';
import { OAuth } from './common/oauth.js';

const { SITE_URL = 'https://sebastiandemo.netlify.app' } = process.env;

export const handler = async (event) => {
  const { code } = event.queryStringParameters;
  const cookies = cookie.parse(event.headers.cookie || '');
  const { provider = 'github', referer = '/admin' } = cookies;

  const oauth = new OAuth(provider);

  try {
    const result = await oauth.getToken(code);
    const { access_token, token_type } = result.token;

    return {
      statusCode: 302,
      headers: {
        Location: `${SITE_URL}${referer}#access_token=${access_token}&token_type=${token_type}`,
        'Cache-Control': 'no-cache',
      },
    };
  } catch (e) {
    console.error('OAuth callback error:', e.message);
    return {
      statusCode: 500,
      body: `OAuth Server Error: ${e.message}`,
    };
  }
};
