import { AuthorizationCode } from 'simple-oauth2';

export class OAuth {
  constructor(provider) {
    this.client = new AuthorizationCode({
      client: {
        id: process.env.GITHUB_CLIENT_ID,
        secret: process.env.GITHUB_CLIENT_SECRET,
      },
      auth: {
        tokenHost: 'https://github.com',
        authorizePath: '/login/oauth/authorize',
        tokenPath: '/login/oauth/access_token',
      },
    });
  }

  getAuthorizationURL(scope = 'user:email') {
    return this.client.authorizeURL({
      redirect_uri: process.env.OAUTH_CALLBACK, // 👈 este debe ser idéntico al configurado en GitHub
      scope,
    });
  }
}
