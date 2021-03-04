import axios from 'axios';

type GrowiApiMethod = 'GET' | 'POST';

// @see: https://docs.growi.org/en/api/rest-v3.html
// @see: https://github.com/weseek/growi/blob/6ec96c37873e8c20205034fe8c59f021b477c863/src/server/routes/index.js
export class Growi {
  protected accessToken: string;
  protected urlString: string;
  constructor(url: string, accessToken: string) {
    this.accessToken = accessToken;
    this.urlString = url;
  }

  public async getPageByPath(path: string) {
    const res = await this.growiAPI('/_api/pages.get', 'GET', { 'path': path });
    return res.data.page;
  }

  public async createPage(path: string, body: string) {
    // @see: https://github.com/weseek/growi/issues/3237
    try {
      await this.growiAPI('/_api/v3/pages', 'POST', { path, body });
      return true;
    } catch (error) {
      // Page Existsは無視する
      const trueError = error.response.data.errors.filter((e: any) => e.code != 'page_exists');
      if (trueError.length > 0) {
        throw error;
      }
    }
  }

  // data: { ok: false, error: 'page_id, body and revision_id are required.' }
  public async updatePage(page_id: string, body: string, revision_id: string) {
    return await this.growiAPI('/_api/pages.update', 'POST', { page_id, body, revision_id });
  }

  public getUrlByPath(path: string) {
    const url = this.getURL();
    url.pathname = path;
    return url.toString();
  }

  protected async growiAPI(apiPath: string, apiMethod: GrowiApiMethod, params={}) {
    const url = this.getURL();
    url.pathname = apiPath;
    params = Object.assign(params, { 'access_token': this.accessToken });
    const res = await (() => {
      if (apiMethod == 'GET') {
        return axios.get(url.toString(), { params });
      } else {
        return axios.post(url.toString(), params);
      }
    })();

    return res;
  }

  protected getURL(): URL {
    return new URL(this.urlString);
  }
}
