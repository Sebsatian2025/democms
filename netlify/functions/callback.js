// netlify/functions/callback.js
import cookie from 'cookie';
import { OAuth } from './common/oauth.js';

export const handler = async (event) => {
  const { code } = event.queryStringParameters;
  const { provider } = cookie.parse(event.headers.cookie || '');
  if (!provider) {
    return { statusCode: 400, body: 'Provider not found in cookie' };
  }

  const oauth = new OAuth(provider);

  try {
    const { token } = await oauth.getToken(code);
    const { access_token, token_type } = token;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: `
        <html>
          <body>
            <script>
              const token = "${access_token}";
              const type = "${token_type}";
              window.location.href = "/admin/#access_token=" + token + "&token_type=" + type;
            </script>
          </body>
        </html>
      `,
    };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: 'Server Error' };
  }
};


