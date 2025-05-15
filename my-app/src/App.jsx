import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';
import PrivateRoute from './components/shared/PrivateRoute';
import Login from './pages/auth/Login';
// import Signup from './pages/Auth/SignUp';
import Dashboard from './pages/Dashboard/Dashboard';
import Medications from './pages/Medications/Medications';
import Reminders from './pages/Reminders/Reminders';
import Settings from './pages/Settings/Settings';
import Signup from './pages/auth/Signup';
import Navigation from './components/shared/Navigation';
function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <AuthProvider>
           <Navigation />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/medications" element={<Medications />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;