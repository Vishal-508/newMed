import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { Card, Button, Input, Switch } from '../../components/ui';

const SettingsContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Section = styled(Card)`
  margin-bottom: 1.5rem;
  padding: 1.5rem;
`;

const SectionTitle = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    notifications: true,
    darkMode: false,
    calendarIntegration: false
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        name: user.name || '',
        notifications: user.notifications !== false,
        darkMode: user.darkMode || false,
        calendarIntegration: user.calendarIntegration || false
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings');
    }
  };

  return (
    <SettingsContainer>
      <h1>Settings</h1>
      
      <form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>Account Information</SectionTitle>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </FormGroup>
        </Section>

        <Section>
          <SectionTitle>Notification Preferences</SectionTitle>
          <FormGroup>
            <Switch
              id="notifications"
              name="notifications"
              checked={formData.notifications}
              onChange={handleChange}
              label="Enable medication reminders"
            />
          </FormGroup>
          <FormGroup>
            <Switch
              id="darkMode"
              name="darkMode"
              checked={formData.darkMode}
              onChange={handleChange}
              label="Dark mode"
            />
          </FormGroup>
        </Section>

        <Section>
          <SectionTitle>Calendar Integration</SectionTitle>
          <FormGroup>
            <Switch
              id="calendarIntegration"
              name="calendarIntegration"
              checked={formData.calendarIntegration}
              onChange={handleChange}
              label="Sync reminders with Google Calendar"
            />
          </FormGroup>
          {formData.calendarIntegration && (
            <Button type="button" variant="outline">
              Connect Google Calendar
            </Button>
          )}
        </Section>

        <Button type="submit">Save Changes</Button>
      </form>
    </SettingsContainer>
  );
};

export default Settings;