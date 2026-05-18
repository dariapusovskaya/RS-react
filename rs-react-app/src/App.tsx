import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import { Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import ItemDetails from './components/ItemDetails/ItemDetails';


const App = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<RootLayout />}>
         
          <Route path='/' element={<HomePage />} >
          
          {/* Маршрут для деталей — отдельная страница */}
          <Route path="details/:itemId" element={<ItemDetails />} />
          </Route>
          
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}
 
export default App;