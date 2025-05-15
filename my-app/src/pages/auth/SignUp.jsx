import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';
import { Button, Input, Card } from '../../components/ui';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signup(email, password, name);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <SignupCard>
        <Title>Create Account</Title>
        <Subtitle>Get started with MedTrack</Subtitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Full Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </FormGroup>
          
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
              placeholder="Create a password"
              required
            />
          </FormGroup>
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </SubmitButton>
        </Form>
        
        <LoginText>
          Already have an account? <LoginLink to="/login">Log in</LoginLink>
        </LoginText>
      </SignupCard>
    </Container>
  );
};

// Reuse most styled components from Login.jsx
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  padding: 2rem;
`;

const SignupCard = styled(Card)`
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

const LoginText = styled.p`
  text-align: center;
  margin-top: 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const LoginLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primaryDark};
  font-weight: 500;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export default Signup;


// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import styled from 'styled-components';
// import { Button, Input, Card } from '../../components/ui';

// const Signup = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { signup } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setError('');
//       setLoading(true);
//       await signup(email, password, name);
//       navigate('/');
//     } catch (err) {
//       setError(err.message || 'Failed to create account');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container>
//       <SignupCard>
//         <h2>Sign Up</h2>
//         {error && <ErrorMessage>{error}</ErrorMessage>}
//         <Form onSubmit={handleSubmit}>
//           <Input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Full Name"
//             required
//           />
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
//             {loading ? 'Creating account...' : 'Sign Up'}
//           </Button>
//         </Form>
//       </SignupCard>
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

// const SignupCard = styled(Card)`
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
//   margin-bottom: 1rem;
// `;

// export default Signup;
