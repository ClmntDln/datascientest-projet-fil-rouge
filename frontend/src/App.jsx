import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PageLoader from './components/PageLoader';
import logo from './assets/weeb-logo.svg';

const Home = lazy(() => import('./pages/Home'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Blog = lazy(() => import('./pages/Blog'));
const Article = lazy(() => import('./pages/Article'));
const ArticleNew = lazy(() => import('./pages/ArticleNew'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const AdminMessages = lazy(() => import('./pages/AdminMessages'));
const AdminMonitoring = lazy(() => import('./pages/AdminMonitoring'));
const Account = lazy(() => import('./pages/Account'));
const Privacy = lazy(() => import('./pages/Privacy'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navigation logo={logo} />
                <main>
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/confidentialite" element={<Privacy />} />
                            <Route path="/compte" element={<ProtectedRoute requireActive={false}><Account /></ProtectedRoute>} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/reset-password" element={<ResetPassword />} />
                            <Route path="/blog" element={<Blog />} />
                            <Route path="/blog/nouveau" element={<ProtectedRoute><ArticleNew /></ProtectedRoute>} />
                            <Route path="/admin/utilisateurs" element={<ProtectedRoute staffOnly><AdminUsers /></ProtectedRoute>} />
                            <Route path="/admin/messages" element={<ProtectedRoute staffOnly><AdminMessages /></ProtectedRoute>} />
                            <Route path="/admin/monitoring" element={<ProtectedRoute staffOnly><AdminMonitoring /></ProtectedRoute>} />
                            <Route path="/blog/:id" element={<Article />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                </main>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;
