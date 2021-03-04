"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const autoweekly_1 = require("./autoweekly");
process.on('unhandledRejection', console.dir);
autoweekly_1.main({
    'growiAccessToken': process.env.GROWI_ACCESS_TOKEN,
    'growiAppSiteUrl': process.env.GROWI_APP_SITE_URL,
    'pocketConsumerKey': process.env.POCKET_CONSUMER_KEY,
    'pocketRequestToken': process.env.POCKET_REQUEST_TOKEN
});
//# sourceMappingURL=index.js.map