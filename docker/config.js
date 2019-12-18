var config = {};
config.development = {
  // Config for database, only support mysql.
  db: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT || 3306,
    dialect: "mysql",
    logging: false,
    operatorsAliases: false,
  },
  // 如果存储类型“storageType”为“qiniu”如果更新包放在七牛，需要配置相关信息 (http://www.qiniu.com/) 。
  qiniu: {
    accessKey: "PTVdOXdxrBizsZLfS60dFmw8xcm7QflArsEjho8q",
    secretKey: "gYFSlO9BgUK81UGY619wBkDR6SwJiEhyC7iDWZGX",
    bucketName: "ynsyimg-test",
    downloadUrl: "http://testimg.ynsy.com" // Binary files download host address.
  },
  // Config for local storage when storageType value is "local".
  local: {
    // Binary files storage dir, Do not use tmpdir and it's public download dir.
    // storageDir: process.env.STORAGE_DIR,
    storageDir: "/Users/wuguanghua/WorkSpace/code-push-server/storage/storage",
    // Binary files download host address which Code Push Server listen to. the files storage in storageDir.
    // downloadUrl: process.env.DOWNLOAD_URL,
    downloadUrl: "http://192.168.0.98:3000/download",
    // public static download spacename.
    public: '/download'
  },
  jwt: {
    // Recommended: 63 random alpha-numeric characters
    // Generate using: https://www.grc.com/passwords.htm
    tokenSecret: 'wAW3ei4JP5ypmW60nwKGrKl741Ipybc6VrU5g47oHVLvogSVIR7g5qiioKkfXwL'
  },
  common: {
    /*
     * tryLoginTimes is control login error times to avoid force attack.
     * if value is 0, no limit for login auth, it may not safe for account. when it's a number, it means you can
     * try that times today. but it need config redis server.
     */
    tryLoginTimes: 4,
    // CodePush Web(https://github.com/lisong/code-push-web) login address.
    //codePushWebUrl: "http://127.0.0.1:3001/login",
    // create patch updates's number. default value is 3
    diffNums: 3,
    // data dir for caclulate diff files. it's optimization.
    // dataDir: process.env.DATA_DIR,
    dataDir: "/Users/wuguanghua/WorkSpace/code-push-server/storage/data",
    // storageType which is your binary package files store. options value is ("local" | "qiniu" | "s3")
    storageType: "qiniu",
    // options value is (true | false), when it's true, it will cache updateCheck results in redis.
    updateCheckCache: false,
    // options value is (true | false), when it's true, it will cache rollout results in redis
    rolloutClientUniqueIdCache: false,
  },
  // Config for smtp email，register module need validate user email project source https://github.com/nodemailer/nodemailer
  smtpConfig:{
    host: "smtp.aliyun.com",
    port: 465,
    secure: true,
    auth: {
      user: "",
      pass: ""
    }
  },
  // Config for redis (register module, tryLoginTimes module)
  redis: {
    default: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT || 6379,
      retry_strategy: function (options) {
        if (options.error.code === 'ECONNREFUSED') {
          // End reconnecting on a specific error and flush all commands with a individual error
          return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          // End reconnecting after a specific timeout and flush all commands with a individual error
          return new Error('Retry time exhausted');
        }
        if (options.times_connected > 10) {
          // End reconnecting with built in error
          return undefined;
        }
        // reconnect after
        return Math.max(options.attempt * 100, 3000);
      }
    }
  }
}

config.development.log4js = {
  appenders: {console: { type: 'console'}},
  categories : {
    "default": { appenders: ['console'], level:'error'},
    "startup": { appenders: ['console'], level:'info'},
    "http": { appenders: ['console'], level:'info'}
  }
}

config.production = Object.assign({}, config.development);
module.exports = config;
