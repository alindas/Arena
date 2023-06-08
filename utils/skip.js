function renderOne() {
  let skipWrapper = document.createElement('div')
  skipWrapper.classList.add('loading-skip-wrapper')
  let skip = document.createElement('div')
  skip.classList.add('loading-skip')
  skipWrapper.append(skip)
  document.body.append(skipWrapper)
  return () => {
    document.body.removeChild(skipWrapper)
  }
}

function renderTwo() {
  let skipWrapper = document.createElement('div')
  skipWrapper.classList.add('loading-skip-wrapper')
  Array(3).fill(null).forEach(o => {
    let loader = document.createElement('div')
    loader.classList.add('loading-loader')
    skipWrapper.append(loader)
  })
  document.body.append(skipWrapper)
  return () => {
    document.body.removeChild(skipWrapper)
  }
}

/**
 * 开启加载动画
 * @param {1|2|3} type
 * @returns {function} 清除动画
 */
function createSkip(type) {
  let clear;
  switch(type) {
    case 1: {
      clear = renderOne()
      break
    }
    case 2: {
      clear = renderTwo()
      break
    }
    default: {
      clear = renderOne()
      break
    }
  }
  return clear
}

module.exports = createSkip
