import { lazy } from 'react'
import lazyLoad from './LazyLoad'
import List from '@/List'

const Pawd = lazy(() => import('@/components/Pawd'))
const Demo = lazy(() => import('@/components/Demo'))
const SW = lazy(() => import('@/components/ServiceWorker'))
const Notice = lazy(() => import('@/components/Demo/Notice'))

interface IMetaProps {
  keepAlive?: boolean
  requiresAuth?: boolean
  title: string
  key?: string
}

interface IRouteObject {
  caseSensitive?: boolean
  children?: IRouteObject[]
  element?: React.ReactNode
  title?: string
  index?: boolean
  path?: string
  meta?: IMetaProps
  isLink?: string
}

const routes: IRouteObject[] = [

  {
    path: '/',
    element: <List />,
    title: '首页'
  },
  {
    path: '/password',
    element: lazyLoad(Pawd),
    title: '密码验证'
  },
  {
    path: '/sw',
    element: lazyLoad(SW),
    title: 'ServiceWorker'
  },
  {
    path: '/notice',
    element: lazyLoad(Notice),
    title: 'Notice'
  },
  {
    path: '/demo',
    element: lazyLoad(Demo),
    title: '测试组件'
  },

  // {
  //   path: '/404',
  //   element: lazyLoad(NotFound),
  //   title: '404'
  // },
  // {
  //   path: '*',
  //   element: <Navigate to="/404" />,
  //   title: '404'
  // }
]

export default routes
