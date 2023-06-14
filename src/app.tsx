import { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import store from './model'
import { useLaunch } from '@tarojs/taro'

import 'taro-ui/dist/style/index.scss'

function App({ children }: PropsWithChildren) {

  useLaunch(() => {
    console.log('App launched.')
  })

  // children 是将要会渲染的页面
  // return children
  return <Provider store={store}>{children}</Provider>
}

export default App
