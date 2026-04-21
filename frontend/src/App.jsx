import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/navigation';
import Footer from './components/footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ResetPassword from './pages/ResetPassword';
import Blog from './pages/Blog';
import Article from './pages/Article';
import ArticleNew from './pages/ArticleNew';
import AdminUsers from './pages/AdminUsers';
import logo from './assets/weeb-logo.svg';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navigation logo={logo} />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/nouveau" element={<ProtectedRoute><ArticleNew /></ProtectedRoute>} />
                        <Route
                            path="/admin/utilisateurs"
                            element={(
                                <ProtectedRoute staffOnly>
                                    <AdminUsers />
                                </ProtectedRoute>
                            )}
                        />
                        <Route path="/blog/:id" element={<Article />} />
                    </Routes>
                </main>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;
