const server = require('./server');

const config = {
  meta: server.meta,
  homeContent: server.homeContent,
  sponsors: server.sponsors,
  globalSiteTag: server.globalSiteTag,
  ctfName: server.ctfName,
  divisions: server.divisions,
  defaultDivision: server.defaultDivision,
  origin: server.origin,
  startTime: server.startTime,
  endTime: server.endTime,
  emailEnabled: server.email != null,
  userMembers: server.userMembers,
  faviconUrl: server.faviconUrl,
  ctftime: server.ctftime == null ? undefined : {
    clientId: server.ctftime.clientId
  },
  recaptcha: server.recaptcha == null ? undefined : {
    siteKey: server.recaptcha.siteKey,
    protectedActions: server.recaptcha.protectedActions
  }
};

module.exports = config;
