// Signup.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUser } from '../userSlice';
import { AppDispatch } from '../../../store';
import { useNavigate } from 'react-router-dom';
import { selectCategories } from '../../../Redux-slices/categories/categorySlices';
import Select from 'react-select';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'; // Importing Material Design icons
import './SignupForm.scss';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [selectedPreferences, setSelectedPreferences] = useState<any[]>([]);
  const [isGuest, setIsGuest] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const dispatch: AppDispatch = useDispatch();
  const categories = useSelector(selectCategories);

  const navigate = useNavigate();

  const validateForm = () => {
    setError('');
    if (!isGuest) {
      if (!username.trim()) {
        setError('Username is required');
        return false;
      }
      if (!password) {
        setError('Password is required');
        return false;
      }
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:5000/user/signup', {
        username,
        password,
        preferences: selectedPreferences.map(option => option.value),
        isGuest,
        rememberMe,
      }, { withCredentials: true });

      if (response.status === 201) {
        dispatch(setUser({
          username: response.data.username,
          description: response.data.description ? response.data.description : null,
          preferences: response.data.preferences,
          postedContent: response.data.postedContent,
          followers: response.data.followers,
          following: response.data.following,
          likedIdeas: response.data.likedIdeas,
          dislikedIdeas: response.data.dislikedIdeas,
        }));

        alert(isGuest ? 'Guest signup successful' : 'Signup successful');
        navigate('/');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Signup failed. Please try again.');
    }
  };

  useEffect(() => {
    if (isGuest) {
      handleSignup();
    }
  }, [isGuest]);

  const handleSelectChange = (selectedOptions: any) => {
    if (selectedOptions.length <= 5) {
      setSelectedPreferences(selectedOptions);
    } else {
      alert("You can only select up to 5 preferences.");
    }
  };

  const CustomMultiValue = () => null;

  return (
    <div className='signup-form-cont'>
      <div className='signup-form'>
        <h2>Signup</h2>
        {error && <div className="error">{error}</div>}
        {!isGuest && (
          <>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span 
                className="toggle-password" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
              </span>
            </div>
          </>
        )}
        {/* Preferences dropdown */}
        <div className="preferences-dropdown">
          <label>Select Preferences :</label>
          <Select
            options={categories.map(category => ({ value: category, label: category }))}
            isMulti
            onChange={handleSelectChange}
            value={selectedPreferences}
            components={{ MultiValue: CustomMultiValue }}
            placeholder="Select your preferences..."
            styles={{
              control: (provided) => ({
                ...provided,
                border: '1px solid #e2e8f0',
                borderRadius: '0.75rem',
                boxShadow: 'none',
                '&:hover': {
                  borderColor: '#3b82f6',
                },
              }),
              menu: (provided) => ({
                ...provided,
                zIndex: 9999, // Ensure dropdown appears above other elements
              }),
              menuList: (provided) => ({
                ...provided,
                maxHeight: '150px', // Set max height for the dropdown
                overflowY: 'auto', // Enable vertical scrolling
              }),
            }}
          />

          {/* Custom bubbles for selected preferences */}
          <div className="selected-preferences">
            {selectedPreferences.map((preference, index) => (
              <div key={index} className="preference-bubble">
                {preference.label}
                <span onClick={() => setSelectedPreferences(selectedPreferences.filter(pref => pref.value !== preference.value))}>&times;</span>
              </div>
            ))}
          </div>
        </div>
        <div className="remember-me">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <label htmlFor="rememberMe">Remember Me</label>
        </div>
        <div className="signup-buttons">
          <button onClick={handleSignup}>Sign Up</button>
          <button onClick={() => { setIsGuest(true); }}>Continue as Guest</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
