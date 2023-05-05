import { HashRouter } from 'react-router-dom'
import { Router } from './routes/renderRoutes'
import routes from './routes'
import { Suspense, FC } from 'react'

const App: FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <HashRouter>
      <Router routes={routes} />
    </HashRouter>
  </Suspense>
)
export default App
