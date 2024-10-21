import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { selectUser, updatePref } from '../../Auth/userSlice';
import { selectCategories } from '../../../Redux-slices/categories/categorySlices';
import Select from 'react-select';
import "../Settings.scss"

const PrefSettings: React.FC = () => {
  const user = useSelector(selectUser);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(user.preferences);
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch();

  // Convert categories into a format compatible with react-select options
  const categoryOptions = categories.map((category: string) => ({
    value: category,
    label: category,
  }));

  // Handle selection change in react-select
  const handlePreferenceChange = (selectedOptions: any) => {
    if (selectedOptions.length <= 5) {
      setSelectedPreferences(selectedOptions.map((option: any) => option.value));
    } else {
      alert("You can only select up to 5 preferences.");
    }
  };

  const changePreferences = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/user/update/preferences`,
        { 
          username: user.username,
          preferences: selectedPreferences
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        dispatch(updatePref(selectedPreferences));
        alert('Preferences updated successfully!');
      } else {
        alert('Failed to update preferences');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Failed to update preferences');
    }
  };

  const CustomMultiValue = () => null;

  return (
    <div>
      <div className="preferences-dropdown">
        <label>Select Preferences (Max 5):</label>
        {/* React Select component */}
        <Select
          isMulti
          options={categoryOptions}
          value={categoryOptions.filter(option => selectedPreferences.includes(option.value))}
          onChange={handlePreferenceChange}
          components={{ MultiValue: CustomMultiValue }}
          placeholder="Select preferences"
          className="react-select-container"
          classNamePrefix="react-select"
          isClearable={false}
          
        />
        <div className="selected-preferences">
          {selectedPreferences.map((preference, index) => (
            <div key={index} className="preference-bubble">
              {preference}
              <span onClick={() => setSelectedPreferences(
                selectedPreferences.filter((pref) => pref !== preference)
              )}>
                &times;
              </span>
            </div>
          ))}
        </div>
      </div>
      <button onClick={changePreferences}>Save</button>
    </div>
  );
};

export default PrefSettings;
