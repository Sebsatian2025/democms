// netlify/functions/common/oauth.js
import { AuthorizationCode } from 'simple-oauth2';

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
      redirect_uri: OAUTH_CALLBACK,
      scope,
    });
  }

  async getToken(code) {
    return this.client.getToken({
      code,
      redirect_uri: OAUTH_CALLBACK,
    });
  }
}

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, OAUTH_CALLBACK } = process.env;

const OAUTH_PROVIDERS = {
  github: {
    client_id: GITHUB_CLIENT_ID,
    client_secret: GITHUB_CLIENT_SECRET,
    url: 'https://github.com',
  },
};
