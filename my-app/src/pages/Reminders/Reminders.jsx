import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, Switch, Button } from '../../components/ui';

const Reminders = () => {
  const [settings, setSettings] = useState({
    enableInApp: true,
    enableCalendar: false,
    advanceNotice: 15
  });

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    // Here you would typically call your API to save settings
  };

  return (
    <Container>
      <h1>Reminder Settings</h1>
      
      <SettingsCard>
        <SettingItem>
          <label>In-App Notifications</label>
          <Switch
            checked={settings.enableInApp}
            onChange={(e) => handleChange('enableInApp', e.target.checked)}
          />
        </SettingItem>

        <SettingItem>
          <label>Google Calendar Integration</label>
          <Switch
            checked={settings.enableCalendar}
            onChange={(e) => handleChange('enableCalendar', e.target.checked)}
          />
        </SettingItem>

        <SettingItem>
          <label>Advance Notice (minutes)</label>
          <input
            type="number"
            value={settings.advanceNotice}
            onChange={(e) => handleChange('advanceNotice', parseInt(e.target.value))}
            min="1"
            max="120"
          />
        </SettingItem>
      </SettingsCard>

      <Button onClick={() => alert('Settings saved!')}>
        Save Settings
      </Button>
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
   width: 100svw;
`;

const SettingsCard = styled(Card)`
  padding: 1.5rem;
  margin: 1.5rem 0;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  input[type="number"] {
    width: 60px;
    padding: 0.5rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
  }
`;

export default Reminders;


// import { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import { getReminderSettings, updateReminderSettings } from '../../services/reminder.service';
// import { Card, Switch, Button } from '../../components/ui/Button';

// const Reminders = () => {
//   const [settings, setSettings] = useState({
//     enableInApp: true,
//     enableCalendar: false,
//     advanceNotice: 15
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchSettings = async () => {
//       try {
//         const { data } = await getReminderSettings();
//         setSettings(data);
//       } catch (err) {
//         setError('Failed to load settings');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSettings();
//   }, []);

//   const handleUpdate = async (field, value) => {
//     try {
//       const updatedSettings = { ...settings, [field]: value };
//       const { data } = await updateReminderSettings(updatedSettings);
//       setSettings(data);
//     } catch (err) {
//       setError('Failed to update settings');
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <Container>
//       <h1>Reminder Settings</h1>
      
//       <SettingsCard>
//         <SettingItem>
//           <label>In-App Notifications</label>
//           <Switch
//             checked={settings.enableInApp}
//             onChange={(e) => handleUpdate('enableInApp', e.target.checked)}
//           />
//         </SettingItem>

//         <SettingItem>
//           <label>Google Calendar Integration</label>
//           <Switch
//             checked={settings.enableCalendar}
//             onChange={(e) => handleUpdate('enableCalendar', e.target.checked)}
//           />
//         </SettingItem>

//         <SettingItem>
//           <label>Advance Notice (minutes)</label>
//           <input
//             type="number"
//             value={settings.advanceNotice}
//             onChange={(e) => handleUpdate('advanceNotice', parseInt(e.target.value))}
//             min="1"
//             max="120"
//           />
//         </SettingItem>
//       </SettingsCard>

//       {settings.enableCalendar && (
//         <GoogleCalendarSetup />
//       )}
//     </Container>
//   );
// };

// const Container = styled.div`
//   padding: 2rem;
// `;

// const SettingsCard = styled(Card)`
//   padding: 1.5rem;
//   margin-top: 1rem;
// `;

// const SettingItem = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 1rem 0;
//   border-bottom: 1px solid ${({ theme }) => theme.colors.border};

//   &:last-child {
//     border-bottom: none;
//   }
// `;

// export default Reminders;