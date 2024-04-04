import { ThemeProvider } from './theme'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/query'
import Home from './Home'

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
