import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom'; // No need to import BrowserRouter here
import ProtectedRoute from './pages/ProtectedRoute';
import Loading from './pages/Loading';
import "./App.css"
import { ToastProvider } from './context/ToastContext';



// Lazy loading components
const Navbar = lazy(() => import('./pages/Navbar'));
const Home = lazy(() => import('./pages/Home'));
const RealTimeSentimentAnalysis = lazy(() => import('./pages/RealTimeSentimentAnalysis'));
const YoutubeAnalysis = lazy(() => import('./pages/YoutubeAnalysis'));
const Footer = lazy(() => import('./pages/Footer'));
const RedditAnalysis = lazy(() => import('./pages/RedditAnalysis'));
const EmotionDetection = lazy(() => import ('./pages/EmotionDetection'))
const ImageDetection = lazy(() => import ('./pages/ImageDetection'))
const VideoDetection = lazy(() => import ('./pages/VideoDetection'))
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const GoogleSignup = lazy(() => import('./pages/GoogleSignup'));
const LogoutPage = lazy(() => import('./pages/LogoutPage'));
const AboutUs = lazy(() => import('./pages/About'));
const Blog = lazy(()=> import('./pages/Blog'));
const Contact = lazy(()=> import('./pages/Contact'));
const Faq = lazy(()=> import('./pages/Faq'));
const NotFound = lazy(() => import ('./pages/NotFound'));
const Docs = lazy(() => import ('./pages/Docs'));
const Privacy = lazy(() => import ('./pages/PrivacyPolicy'));
const Terms = lazy(() => import ('./pages/TermsOfUse'));
const ResetPassword = lazy(() => import ('./pages/ResetPassword'))
const ForgotPassword = lazy(() => import ('./pages/ForgotPassword'))




// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }

    return this.props.children;
  }
}

const App = () => {
  return (
    <div id="app-container">
      <ErrorBoundary>
       <ToastProvider>
        <Suspense fallback={<Loading />}>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
                />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/google-signup" element={<GoogleSignup />} />
              <Route path="/logout" element={<LogoutPage />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faqs" element={<Faq />} />
              <Route path="/realtime-sentiment-analysis" element={<RealTimeSentimentAnalysis />} />
              <Route path="/reddit-analysis" element={<RedditAnalysis />} />
              <Route path="/youtube-analysis" element={<YoutubeAnalysis />} />
              <Route path="/emotion-detection" element={<EmotionDetection />} />
              <Route path="/image-detection" element={<ImageDetection />} />
              <Route path="/video-detection" element={<VideoDetection />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound/>} />
            </Routes>
          </main>
          <Footer />
        </Suspense>
       </ToastProvider>
      </ErrorBoundary>
    </div>
  );
};

export default App;
