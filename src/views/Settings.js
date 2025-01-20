import React from 'react';
import { useParams } from 'react-router-dom';

const Settings = () => {
  const { settingType } = useParams();

  return (
    <div>
      {settingType === 'Account' && (
        <h1>Account Settings</h1>
        // Render account settings content
      )}
      {(!settingType) && (
        <h1>Settings</h1>
        // Render default settings content
      )}
    </div>
  );
};

export default Settings;
