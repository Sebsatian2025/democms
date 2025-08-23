// netlify/functions/callback.js
const CALLBACK = process.env.OAUTH_CALLBACK
  || 'https://sebastiandemo.netlify.app/.netlify/functions/callback';

export const handler = async (event) => {
  // …pasa CALLBACK en vez de process.env.OAUTH_CALLBACK…
  // Ejemplo del primer paso de redirect:
  if (!event.queryStringParameters?.code) {
    const authorizationURL = new OAuth('github').getAuthorizationURL({
      redirect_uri: CALLBACK,
      scope: 'repo',
    });
    return {
      statusCode: 302,
      headers: {
        Location: authorizationURL,
        'Cache-Control': 'no-cache',
      },
    };
  }

  // …y en el callback final:
  const result = await new OAuth('github').getToken(params.code, CALLBACK);
  // redirige así al admin, sin regex complejos:
  return {
    statusCode: 302,
    headers: {
      Location: `https://sebastiandemo.netlify.app/admin#access_token=${result.token.access_token}&token_type=${result.token.token_type}`,
      'Cache-Control': 'no-cache'
    },
  };
};
