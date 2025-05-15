import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <NavContainer>
      <Logo to="/">MedTrack</Logo>
      
      <NavLinks>
        {user && (
          <>
            <NavItem to="/" end>Dashboard</NavItem>
            <NavItem to="/medications">Medications</NavItem>
            <NavItem to="/reminders">Reminders</NavItem>
          </>
        )}
        
        {user ? (
          <NavButton onClick={handleLogout}>Logout</NavButton>
        ) : (
          <>
            <NavItem to="/login">Login</NavItem>
            <NavItem to="/signup">Signup</NavItem>
          </>
        )}
      </NavLinks>
    </NavContainer>
  );
};

// Styled components
const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

const Logo = styled(NavLink)`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const NavItem = styled(NavLink)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.active {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const NavButton = styled.button`
  color: white;
  background: none;
  border: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: inherit;
  font-size: inherit;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export default Navigation;