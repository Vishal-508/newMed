import styled from 'styled-components';

const Button = styled.button`
  background: ${({ theme, variant }) => 
    variant === 'outline' ? 'transparent' : 
    variant === 'danger' ? theme.colors.error : 
    theme.colors.primary};
  color: ${({ theme, variant }) => 
    variant === 'outline' ? theme.colors.primary : 
    variant === 'danger' ? 'white' : 'white'};
  border: ${({ theme, variant }) => 
    variant === 'outline' ? `1px solid ${theme.colors.primary}` : 'none'};
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme, variant }) => 
      variant === 'outline' ? theme.colors.primary + '10' : 
      variant === 'danger' ? theme.colors.errorDark : 
      theme.colors.primaryDark};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.disabled};
    cursor: not-allowed;
  }
`;

export default Button;