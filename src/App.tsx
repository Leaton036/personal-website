import { BrowserRouter } from 'react-router-dom'
import { Starfield } from '@/components/starfield/Starfield'
import { AppRoutes } from './router'

export default function App() {
  return (
    <BrowserRouter>
      <Starfield />
      <AppRoutes />
    </BrowserRouter>
  )
}
