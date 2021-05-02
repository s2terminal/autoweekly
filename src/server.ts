import fastify from 'fastify';
import { main } from './autoweekly';

const server = fastify();

server.get('/autoweekly', async (request, reply) => {
  const resultPath = await main({
    'growiAccessToken': process.env.GROWI_ACCESS_TOKEN as string,
    'growiAppSiteUrl': process.env.GROWI_APP_SITE_URL as string,
    'pocketConsumerKey': process.env.POCKET_CONSUMER_KEY as string,
    'pocketRequestToken': process.env.POCKET_REQUEST_TOKEN as string,
    'pocketAccessToken': process.env.POCKET_ACCESS_TOKEN as string,
  });
  return `Access: ${resultPath}`;
});

server.listen(8080, '0.0.0.0', (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
});
