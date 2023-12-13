const path = require('path');
const fs = require('fs');
const yaml = require('yaml');
const deepMerge = require('deepmerge');
const { nullsafeParseInt, nullsafeParseBoolEnv, removeUndefined } = require('./util');

const jsonLoader = (file) => JSON.parse(file);
const yamlLoader = (file) => yaml.parse(file);

const fileConfigLoaders = new Map([
  ['json', jsonLoader],
  ['yaml', yamlLoader],
  ['yml', yamlLoader]
]);

const configPath = process.env.RCTF_CONF_PATH || path.join(__dirname, '../conf.d');
const fileConfigs = [];
fs.readdirSync(configPath).sort().forEach((name) => {
  const matched = /\.(.+)$/.exec(name);
  if (matched === null) {
    return;
  }
  const loader = fileConfigLoaders.get(matched[1]);
  if (loader === undefined) {
    return;
  }
  const config = loader(fs.readFileSync(path.join(configPath, name)).toString());
  fileConfigs.push(config);
});

const envConfig = {
  database: {
    sql: process.env.RCTF_DATABASE_URL || {
      host: process.env.RCTF_DATABASE_HOST,
      port: nullsafeParseInt(process.env.RCTF_DATABASE_PORT),
      user: process.env.RCTF_DATABASE_USERNAME,
      password: process.env.RCTF_DATABASE_PASSWORD,
      database: process.env.RCTF_DATABASE_DATABASE
    },
    redis: process.env.RCTF_REDIS_URL || {
      host: process.env.RCTF_REDIS_HOST,
      port: nullsafeParseInt(process.env.RCTF_REDIS_PORT),
      password: process.env.RCTF_REDIS_PASSWORD,
      database: nullsafeParseInt(process.env.RCTF_REDIS_DATABASE)
    },
    migrate: process.env.RCTF_DATABASE_MIGRATE
  },
  instanceType: process.env.RCTF_INSTANCE_TYPE,
  tokenKey: process.env.RCTF_TOKEN_KEY,
  origin: process.env.RCTF_ORIGIN,
  ctftime: {
    clientId: process.env.RCTF_CTFTIME_CLIENT_ID,
    clientSecret: process.env.RCTF_CTFTIME_CLIENT_SECRET
  },
  userMembers: nullsafeParseBoolEnv(process.env.RCTF_USER_MEMBERS),
  homeContent: process.env.RCTF_HOME_CONTENT,
  ctfName: process.env.RCTF_NAME,
  meta: {
    description: process.env.RCTF_META_DESCRIPTION,
    imageUrl: process.env.RCTF_IMAGE_URL
  },
  faviconUrl: process.env.RCTF_FAVICON_URL,
  logoUrl: process.env.RCTF_LOGO_URL,
  globalSiteTag: process.env.RCTF_GLOBAL_SITE_TAG,
  email: {
    from: process.env.RCTF_EMAIL_FROM
  },
  startTime: nullsafeParseInt(process.env.RCTF_START_TIME),
  endTime: nullsafeParseInt(process.env.RCTF_END_TIME),
  recaptcha: {
    siteKey: process.env.RCTF_RECAPTCHA_SITE_KEY,
    secretKey: process.env.RCTF_RECAPTCHA_SECRET_KEY
  },
  leaderboard: {
    maxLimit: nullsafeParseInt(process.env.RCTF_LEADERBOARD_MAX_LIMIT),
    maxOffset: nullsafeParseInt(process.env.RCTF_LEADERBOARD_MAX_OFFSET),
    updateInterval: nullsafeParseInt(process.env.RCTF_LEADERBOARD_UPDATE_INTERVAL),
    graphMaxTeams: nullsafeParseInt(process.env.RCTF_LEADERBOARD_GRAPH_MAX_TEAMS),
    graphSampleTime: nullsafeParseInt(process.env.RCTF_LEADERBOARD_GRAPH_SAMPLE_TIME)
  },
  loginTimeout: nullsafeParseInt(process.env.RCTF_LOGIN_TIMEOUT)
};

const defaultConfig = {
  database: {
    migrate: 'never'
  },
  instanceType: 'all',
  userMembers: true,
  sponsors: [],
  homeContent: '',
  faviconUrl: 'https://redpwn.storage.googleapis.com/branding/rctf-favicon.ico',
  challengeProvider: {
    name: 'challenges/database'
  },
  uploadProvider: {
    name: 'uploads/local'
  },
  proxy: {
    cloudflare: false,
    trust: false
  },
  meta: {
    description: '',
    imageUrl: ''
  },
  leaderboard: {
    maxLimit: 100,
    maxOffset: 4294967296,
    updateInterval: 10000,
    graphMaxTeams: 10,
    graphSampleTime: 1800000
  },
  loginTimeout: 3600000
};

const config = deepMerge.all([defaultConfig, ...fileConfigs, removeUndefined(envConfig)]);

module.exports = config;