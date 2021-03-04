import { main } from './autoweekly';
process.on('unhandledRejection', console.dir);

main({
  'growiAccessToken': process.env.GROWI_ACCESS_TOKEN as string,
  'growiAppSiteUrl': process.env.GROWI_APP_SITE_URL as string,
  'pocketConsumerKey': process.env.POCKET_CONSUMER_KEY as string,
  'pocketRequestToken': process.env.POCKET_REQUEST_TOKEN as string,
  'pocketAccessToken': process.env.POCKET_ACCESS_TOKEN as string,
});
