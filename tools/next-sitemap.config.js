const { SITE_URL } = require('../src/constants/site_data');
const { pathList } = require('../src/constants/path_list');

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: [`${pathList.draft}*`],
};
