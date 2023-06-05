function createSkip() {
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

module.exports = createSkip
