import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './Layout';
import Home from './pages/Home';
import HomeCategory from './pages/HomeCategory';
import Men from './pages/Men';
import Women from './pages/Women';
import Kids from './pages/Kids';
import SearchResults from './pages/SearchResults';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Men" element={<Men />} />
                <Route path="/Women" element={<Women />} />
                <Route path="/Kids" element={<Kids />} />
                <Route path="/home" element={<HomeCategory />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/product/:id" element={<Home />} />
              </Routes>
            </Layout>
            <Toaster />
          </Router>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;