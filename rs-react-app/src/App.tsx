import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import { Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';


const App = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path='/' element={<RootLayout />}/>
        <Route index element={<HomePage />}/>
        <Route path='about' element={<AboutPage/>}/>
        <Route path='*' element={<NotFoundPage/>}/>
      </Routes>
    </ErrorBoundary>
  )
}
 
export default App;