import axios from 'axios';
const querystring = require('querystring');

export type PocketItem = {
  item_id: string,
  resolved_id: string,
  given_url: string,
  given_title: string,
  favorite: string,
  status: string,
  time_added: string,
  time_updated: string,
  time_read: string,
  time_favorited: string,
  sort_id: string,
  resolved_title: string,
  resolved_url: string,
  excerpt: string,
  is_article: string,
  is_index: string,
  has_video: string,
  has_image: string,
  word_count: string,
  lang: string,
  top_image_url: string,
  listen_duration_estimate: string,
}

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

  public async get(count: number=100): Promise<{ [key: string]: PocketItem }> {
    if (!this.accessToken) { throw Error('There is no access token. use Pocket.auth()') }
    const url = 'https://getpocket.com/v3/get';
    const params = {
      'consumer_key': this.consumerKey,
      'access_token': this.accessToken,
      'sort': 'newest',
      'count': count
    };
    const res = await axios.get(url, { params });

    return res.data.list;
  }

  // @see https://getpocket.com/developer/docs/authentication
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

export const parsePocketItem = (pocket: PocketItem) => {
  const title = pocket.given_title.length > 0 ? pocket.given_title : pocket.resolved_title;
  const url = pocket.given_url.length > 0 ? pocket.given_url : pocket.resolved_url;
  return { title, url };
}
