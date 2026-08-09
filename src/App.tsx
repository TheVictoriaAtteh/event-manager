import { LoginScreen } from './Features/auth/LoginScreen';

export default function App() {
  return (
    <LoginScreen
      onNavigateToSignUp={() => console.log('Navigate to Sign Up')}
      onNavigateToForgotPassword={() => console.log('Navigate to Forgot Password')}
      onLoginSuccess={() => console.log('Login successful!')}
    />
  );
}