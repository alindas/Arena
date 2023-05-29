const ma = require('./a')
require('./b')

setTimeout(() => {
  ma.x = 2
}, 2000)
