import { Provider } from 'react-redux'
import { store } from '@store/store'
import { GlobalErrorBoundary } from '@errors/GlobalErrorBoundary'
import { AppRouter } from '@routes/AppRouter'

/**
 * App root.
 * Wraps everything in:
 * 1. GlobalErrorBoundary — catches any unhandled React errors
 * 2. Redux Provider — makes the store available to the entire tree
 * 3. AppRouter — handles all routing
 */
const App = () => (
  <GlobalErrorBoundary>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </GlobalErrorBoundary>
)

export default App
