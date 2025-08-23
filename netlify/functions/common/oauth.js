// netlify/functions/common/oauth.js
import { AuthorizationCode } from 'simple-oauth2';

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  SITE_URL = 'https://sebastiandemo.netlify.app',
} = process.env;

const OAUTH_CALLBACK = `${SITE_URL}/.netlify/functions/callback`;

export class OAuth {
  constructor(provider) {
    this.provider = provider;
    const {
      [provider]: { client_id, client_secret, url },
    } = OAUTH_PROVIDERS;
    const config = {
      client: {
        id: client_id,
        secret: client_secret,
      },
      auth: {
        tokenHost: url,
        tokenPath: '/login/oauth/access_token',
        authorizePath: '/login/oauth/authorize',
      },
    };
    this.client = new AuthorizationCode(config);
  }

  getAuthorizationURL(scope) {
    return this.client.authorizeURL({
      redirect_uri: OAUTH_CALLBACK, // 👈 muy importante
      scope,
    });
  }

  async getToken(code) {
    return this.client.getToken({
      code,
      redirect_uri: OAUTH_CALLBACK, // 👈 debe coincidir con lo registrado en GitHub App
    });
  }
}

const OAUTH_PROVIDERS = {
  github: {
    client_id: GITHUB_CLIENT_ID,
    client_secret: GITHUB_CLIENT_SECRET,
    url: 'https://github.com',
  },
};
