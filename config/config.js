var os = require('os');

var config = {};
config.development = {
  // 修改数据库连接信息
  db: {
    username: process.env.RDS_USERNAME || "root",
    password: process.env.RDS_PASSWORD || "root123456",
    database: process.env.DATA_BASE || "codepush",
    host: process.env.RDS_HOST || "localhost",
    port: process.env.RDS_PORT || 3306,
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
  // Config for upyun (https://www.upyun.com/) storage when storageType value is "upyun"
  upyun: {
    storageDir: process.env.UPYUN_STORAGE_DIR,
    serviceName: process.env.UPYUN_SERVICE_NAME,
    operatorName: process.env.UPYUN_OPERATOR_NAME,
    operatorPass: process.env.UPYUN_OPERATOR_PASS,
    downloadUrl: process.env.DOWNLOAD_URL,
  },
  // Config for Amazon s3 (https://aws.amazon.com/cn/s3/) storage when storageType value is "s3".
  s3: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN, //(optional)
    bucketName: process.env.BUCKET_NAME,
    region: process.env.REGION,
    downloadUrl: process.env.DOWNLOAD_URL, // binary files download host address.
  },
  // 阿里云存储配置 当storageType为oss时需要配置
  oss: {
    accessKeyId: "",
    secretAccessKey: "",
    endpoint: "",
    bucketName: "",
    prefix: "", // Key prefix in object key
    downloadUrl: "", // binary files download host address.
  },
  // Config for tencentyun COS (https://cloud.tencent.com/product/cos) when storageType value is "oss".
  tencentcloud: {
    accessKeyId: "",
    secretAccessKey: "",
    bucketName: "",
    region: "",
    downloadUrl: "", // binary files download host address.
  },
  // 文件存储在本地配置 当storageType为local时需要配置
  local: {
    // 待更新文件存储路径
    // Binary files storage dir, Do not use tmpdir and it's public download dir.
    storageDir: process.env.STORAGE_DIR || "/Users/wuguanghua/WorkSpace/code-push-server/storage/storage",
    // 文件下载地址 CodePush Server 地址 + '/download' download对应app.js里面的地址
    downloadUrl: process.env.LOCAL_DOWNLOAD_URL || "http://192.168.0.98:3000/download",
    // public static download spacename.
    public: '/download'
  },
  jwt: {
    // 登录jwt签名密钥，必须更改，否则有安全隐患，可以使用随机生成的字符串
    // Recommended: 63 random alpha-numeric characters
    // Generate using: https://www.grc.com/passwords.htm
    tokenSecret: process.env.TOKEN_SECRET || 'wAW3ei4JP5ypmW60nwKGrKl741Ipybc6VrU5g47oHVLvogSVIR7g5qiioKkfXwL'
  },
  common: {
    /*
     * tryLoginTimes is control login error times to avoid force attack.
     * if value is 0, no limit for login auth, it may not safe for account. when it's a number, it means you can
     * try that times today. but it need config redis server.
     */
    tryLoginTimes: 0,
    // CodePush Web(https://github.com/lisong/code-push-web) login address.
    //codePushWebUrl: "http://127.0.0.1:3001/login",
    // create patch updates's number. default value is 3
    diffNums: 3,
    // data dir for caclulate diff files. it's optimization.
    // 临时文件存储路径.
    // dataDir: process.env.DATA_DIR || os.tmpdir(),
    dataDir: "/Users/wuguanghua/WorkSpace/code-push-server/storage/data",
    // 选择存储类型，目前支持local,oss,qiniu,s3配置
    storageType: process.env.STORAGE_TYPE || "qiniu",
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
      host: "127.0.0.1",
      port: 6379,
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
