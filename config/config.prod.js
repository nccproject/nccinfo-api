exports.security = {
    domainWhiteList: ['http://localhost']  // CORS whitelist sites
}
// or
exports.cors = {
    origin: '*.ncccoin.biz'  // Access-Control-Allow-Origin: *
}

exports.sequelize = {
    logging: false  // disable sql logging
}