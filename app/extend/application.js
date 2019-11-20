const path = require('path')

const CHAIN = Symbol('ncc.chain')

module.exports = {
  get chain() {
    this[CHAIN] = this[CHAIN] || this.nccinfo.lib.Chain.get(this.config.ncc.chain)
    return this[CHAIN]
  },
  get nccinfo() {
    return {
      lib: require(path.resolve(this.config.nccinfo.path, 'lib')),
      rpc: require(path.resolve(this.config.nccinfo.path, 'rpc'))
    }
  }
}
