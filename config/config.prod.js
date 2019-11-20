exports.security = {
    domainWhiteList: ['http://localhost']  // CORS whitelist sites
}
// or
exports.cors = {
    origin: '*'  // Access-Control-Allow-Origin: *
}

exports.sequelize = {
    logging: false  // disable sql logging
}