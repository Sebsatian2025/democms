// netlify/functions/callback.js
import cookie from 'cookie';
import { OAuth } from './common/oauth.js';

export const handler = async (event) => {
  const { code } = event.queryStringParameters;

  // Leemos la cookie del provider
  const { provider } = cookie.parse(event.headers.cookie || '');
  if (!provider) {
    return {
      statusCode: 400,
      body: 'Provider not found in cookie',
    };
  }

  const oauth = new OAuth(provider);

  try {
    // Obtenemos el token de GitHub usando el código recibido
    const { token } = await oauth.getToken(code);
    const { access_token, token_type } = token;

    // Redirigimos al admin usando un pequeño HTML que asegura que Sveltia
    // lea el hash fragment correctamente y evite el bucle infinito
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: `
        <html>
          <body>
            <script>
              const token = "${access_token}";
              const type = "${token_type}";
              // Redirigimos al admin con el hash fragment
              window.location.href = "/admin/#access_token=" + token + "&token_type=" + type;
            </script>
          </body>
        </html>
      `,
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: 'Server Error',
    };
  }
};

