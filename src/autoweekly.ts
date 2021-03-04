import dayjs, { Dayjs } from 'dayjs';
import { Growi } from './growi';
import { Pocket, parsePocketItem, PocketItem } from './pocket';

type Props = {
  growiAppSiteUrl: string,
  growiAccessToken: string,
  pocketConsumerKey: string,
  pocketRequestToken: string,
  pocketAccessToken: string
}

export const main = async (props: Props) => {
  const growi = new Growi(props.growiAppSiteUrl, props.growiAccessToken);

  // 今週のパスを定義する
  const postDate = getNextFriday();
  const path = getPath(postDate);

  // 今週の記事を作成する
  await growi.createPage(path, '## 今週のニューストピックス');
  // 今週の記事を取得する
  const page = await growi.getPageByPath(path);
  let body = page.revision.body;

  // Pocketを取得する
  const pocket = new Pocket(props.pocketConsumerKey, props.pocketRequestToken, props.pocketAccessToken);
  await pocket.auth();
  const pockets = Object.values(await pocket.get());

  // 今週の記事データに追記する
  body = addHeadlines(postDate, body, pockets);

  // 今週の記事を更新する
  if (body != page.revision.body) {
    await growi.updatePage(page._id, body, page.revision._id);
    console.log(`Access: ${growi.getUrlByPath(path)}`);
  }
}

const getPath = (day: Dayjs) => {
  return `/autoweekly/${day.format('YYYY/MM/DD')}`;
}

// 次の金曜日
const getNextFriday = (now=dayjs()) => {
  return now.subtract((now.day()-5)%7, 'day');
}

const addHeadlines = (postDay: Dayjs, body: string, pockets: PocketItem[]) => {
  // 追加日時で降順である必要がある
  pockets = pockets.sort((a,b) => Number(a.time_added) - Number(b.time_added)).reverse();
  for (const pocket of pockets) {
    const { title, url } = parsePocketItem(pocket);
    // 記事の掲載が既にあるなら、そこで終わり
    if (body.indexOf(url) != -1 || body.indexOf(title) != -1) {
      break;
    }
    // 記事の掲載日の1週間前より古い(時刻が小さい)なら、そこで終わり
    if (dayjs.unix(Number(pocket.time_added)) < postDay.subtract(7, 'day')) {
      break;
    }
    const headline = `
### [${title}](${url})
`;

    body += headline;
  }

  return body
}
