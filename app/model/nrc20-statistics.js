module.exports = app => {
  const {INTEGER, CHAR} = app.Sequelize

  let NRC20Statistics = app.model.define('nrc20_statistics', {
    contractAddress: {
      type: CHAR(20).BINARY,
      primaryKey: true
    },
    holders: INTEGER.UNSIGNED,
    transactions: INTEGER.UNSIGNED
  }, {freezeTableName: true, underscored: true, timestamps: false})

  NRC20Statistics.associate = () => {
    const {Nrc20: NRC20} = app.model
    NRC20Statistics.belongsTo(NRC20, {as: 'nrc20', foreignKey: 'contractAddress'})
    NRC20.hasOne(NRC20Statistics, {as: 'statistics', foreignKey: 'contractAddress'})
  }

  return NRC20Statistics
}
