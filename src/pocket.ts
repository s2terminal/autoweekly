import axios from 'axios';
const querystring = require('querystring');

export class Pocket {
  protected consumerKey: string;
  protected requestToken: string | undefined;
  protected accessToken: string | undefined;

  constructor(consumerKey: string, requestToken: string | undefined, accessToken: string | undefined) {
    this.consumerKey = consumerKey;
    // 有効なトークンの時だけセット
    if (accessToken && accessToken?.length > 0) {
      this.accessToken = accessToken;
    }
    if (requestToken && requestToken?.length > 0) {
      this.requestToken = requestToken;
    }
  }

  public async get() {
    if (!this.accessToken) { return false }
    const url = 'https://getpocket.com/v3/get';
    const params = {
      'consumer_key': this.consumerKey,
      'access_token': this.accessToken,
      'sort': 'newest',
      'count': 100
    };
    const res = await axios.get(url, { params });

    return res;
  }

  public async auth() {
    if (this.accessToken) {
      return true;
    } else if (this.requestToken) {
      const accessToken = await this.generateAccessToken(this.requestToken);
      throw Error(`
1: set Environment Variable POCKET_ACCESS_TOKEN=${accessToken}
      `);
    } else {
      const requestToken = await this.generateRequestToken();
      const url = `https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=https://example.com`;
      throw Error(`
1: set Environment Variable POCKET_REQUEST_TOKEN=${requestToken}
2: access: ${url}
      `);
    }
  }

  protected async generateRequestToken() {
    const url = 'https://getpocket.com/v3/oauth/request';
    const params = { "consumer_key": this.consumerKey, "redirect_uri": "https://example.com" };
    const res = await axios.get(url, { params });
    const responseBody = res.data;

    const target = 'code=';
    const requestToken = responseBody.slice(responseBody.indexOf(target) + target.length);
    if (requestToken.length > 0) {
      return requestToken;
    }
    return false;
  }

  protected async generateAccessToken(requestToken: string) {
    const url = 'https://getpocket.com/v3/oauth/authorize';
    const params = { "consumer_key": this.consumerKey, "code": requestToken };
    const res = await axios.post(url, params);
    const responseBody = res.data;

    const values = querystring.parse(responseBody) as { access_token: string, username: string };
    return values.access_token;
  }
}
