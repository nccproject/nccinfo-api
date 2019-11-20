const {Service} = require('egg')

class QRC721Service extends Service {
  async listQRC721Tokens() {
    const db = this.ctx.model
    const {sql} = this.ctx.helper
    let {limit, offset} = this.ctx.state.pagination

    let [{totalCount}] = await db.query(sql`
      SELECT COUNT(DISTINCT(nrc721_token.contract_address)) AS count FROM nrc721_token
      INNER JOIN nrc721 USING (contract_address)
    `, {type: db.QueryTypes.SELECT, transaction: this.ctx.state.transaction})
    let list = await db.query(sql`
      SELECT
        contract.address_string AS address, contract.address AS addressHex,
        nrc721.name AS name, nrc721.symbol AS symbol, nrc721.total_supply AS totalSupply,
        list.holders AS holders
      FROM (
        SELECT contract_address, COUNT(*) AS holders FROM nrc721_token
        INNER JOIN nrc721 USING (contract_address)
        GROUP BY contract_address
        ORDER BY holders DESC
        LIMIT ${offset}, ${limit}
      ) list
      INNER JOIN nrc721 USING (contract_address)
      INNER JOIN contract ON contract.address = list.contract_address
      ORDER BY holders DESC
    `, {type: db.QueryTypes.SELECT, transaction: this.ctx.state.transaction})

    return {
      totalCount,
      tokens: list.map(item => ({
        address: item.addressHex.toString('hex'),
        addressHex: item.addressHex,
        name: item.name.toString(),
        symbol: item.symbol.toString(),
        totalSupply: BigInt(`0x${item.totalSupply.toString('hex')}`),
        holders: item.holders
      }))
    }
  }

  async getAllQRC721Balances(hexAddresses) {
    if (hexAddresses.length === 0) {
      return []
    }
    const db = this.ctx.model
    const {sql} = this.ctx.helper
    let list = await db.query(sql`
      SELECT
        contract.address AS addressHex, contract.address_string AS address,
        nrc721.name AS name,
        nrc721.symbol AS symbol,
        nrc721_token.count AS count
      FROM (
        SELECT contract_address, COUNT(*) AS count FROM nrc721_token
        WHERE holder IN ${hexAddresses}
        GROUP BY contract_address
      ) nrc721_token
      INNER JOIN contract ON contract.address = nrc721_token.contract_address
      INNER JOIN nrc721 ON nrc721.contract_address = nrc721_token.contract_address
    `, {type: db.QueryTypes.SELECT, transaction: this.ctx.state.transaction})
    return list.map(item => ({
      address: item.addressHex.toString('hex'),
      addressHex: item.addressHex,
      name: item.name.toString(),
      symbol: item.symbol.toString(),
      count: item.count
    }))
  }
}

module.exports = QRC721Service
