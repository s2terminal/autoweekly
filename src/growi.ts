import axios from 'axios';

export class Growi {
  protected accessToken: string;
  protected urlString: string;
  constructor(accessToken: string, url: string) {
    this.accessToken = accessToken;
    this.urlString = url;
  }

  public async getPath(path: string) {
    const url = this.getURL();
    url.pathname = '/_api/pages.get';
    const res = await axios.get(url.toString(), {
      params: {
        'access_token': this.accessToken,
        'path': path
      }
    });

    return res;
  }

  protected getURL(): URL {
    return new URL(this.urlString);
  }
}
