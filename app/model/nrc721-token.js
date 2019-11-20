module.exports = app => {
  const {CHAR} = app.Sequelize

  let QRC721Token = app.model.define('nrc721_token', {
    contractAddress: {
      type: CHAR(20).BINARY,
      primaryKey: true
    },
    tokenId: {
      type: CHAR(32).BINARY,
      primaryKey: true
    },
    holder: CHAR(20).BINARY
  }, {freezeTableName: true, underscored: true, timestamps: false})

  QRC721Token.associate = () => {
    const {Contract} = app.model
    Contract.hasMany(QRC721Token, {as: 'nrc721Tokens', foreignKey: 'contractAddress'})
    QRC721Token.belongsTo(Contract, {as: 'contract', foreignKey: 'contractAddress'})
  }

  return QRC721Token
}
