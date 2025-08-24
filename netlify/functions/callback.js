// netlify/functions/callback.js
const cookie = require('cookie')
const { OAuth } = require('./common/oauth.js')

exports.handler = async (event) => {
  const { code } = event.queryStringParameters

  // Leemos la cookie del provider que guardamos en /auth
  const { provider } = cookie.parse(event.headers.cookie || '')
  if (!provider) {
    return {
      statusCode: 400,
      body: 'Provider not found in cookie',
    }
  }

  const oauth = new OAuth(provider)

  try {
    // Obtenemos el token de GitHub usando el código recibido
    const { token } = await oauth.getToken(code)
    const { access_token, token_type } = token

    // Guardar cookie de jwt (no HttpOnly) para que Sveltia pueda leerla
    const tokenCookie = cookie.serialize('jwt', access_token, {
      httpOnly: false,
      path: '/',
      maxAge: 3600,
      sameSite: 'lax',
    })

    // Redirigimos al admin de Sveltia con el fragmento como antes
    return {
      statusCode: 302,
      headers: {
        'Set-Cookie': tokenCookie,
        Location: `/admin/#access_token=${access_token}&token_type=${token_type}`,
        'Cache-Control': 'no-cache',
      },
    }
  } catch (e) {
    console.error(e)
    return {
      statusCode: 500,
      body: 'Server Error',
    }
  }
}


    };
  }
};

