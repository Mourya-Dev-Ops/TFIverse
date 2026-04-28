import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import Persons from './pages/Persons';
import PersonDetail from './pages/PersonDetail';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:id" element={<MovieDetail />} />
            <Route path="/persons" element={<Persons />} />
            <Route path="/persons/:id" element={<PersonDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <span className="text-6xl">🎬</span>
      <h1 className="text-3xl font-bold">404 – Page Not Found</h1>
      <a href="/" className="btn-brand">Go Home</a>
    </div>
  );
}
