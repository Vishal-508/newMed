import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';
import { Button, Input, Card } from '../../components/ui';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginCard>
        <Title>Welcome Back</Title>
        <Subtitle>Please enter your details</Subtitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </FormGroup>
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </SubmitButton>
        </Form>
        
        <SignupText>
          Don't have an account? <SignupLink to="/signup">Sign up</SignupLink>
        </SignupText>
      </LoginCard>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  padding: 2rem;
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 500px;
  padding: 3rem 2rem;
  background: ${({ theme }) => theme.colors.cardBackground};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.primaryDark};
  font-size: 2rem;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 500;
`;

const SubmitButton = styled(Button)`
  margin-top: 1rem;
  background-color: ${({ theme }) => theme.colors.primaryDark};
  color: white;
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDarker};
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  background-color: ${({ theme }) => theme.colors.errorLight};
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const SignupText = styled.p`
  text-align: center;
  margin-top: 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SignupLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primaryDark};
  font-weight: 500;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export default Login;


// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import styled from 'styled-components';
// import { Button, Input, Card } from '../../components/ui';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setError('');
//       setLoading(true);
//       await login(email, password);
//       navigate('/');
//     } catch (err) {
//       setError('Failed to log in');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container>
//       <LoginCard>
//         <h2>Log In</h2>
//         {error && <ErrorMessage>{error}</ErrorMessage>}
//         <Form onSubmit={handleSubmit}>
//           <Input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             required
//           />
//           <Input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             required
//           />
//           <Button type="submit" disabled={loading}>
//             {loading ? 'Logging in...' : 'Log In'}
//           </Button>
//         </Form>
//       </LoginCard>
//     </Container>
//   );
// };

// const Container = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   min-height: 100vh;
//   background: ${({ theme }) => theme.colors.background};
// `;

// const LoginCard = styled(Card)`
//   width: 400px;
//   padding: 2rem;
// `;

// const Form = styled.form`
//   display: flex;
//   flex-direction: column;
//   gap: 1rem;
// `;

// const ErrorMessage = styled.p`
//   color: ${({ theme }) => theme.colors.error};
// `;

// export default Login;



