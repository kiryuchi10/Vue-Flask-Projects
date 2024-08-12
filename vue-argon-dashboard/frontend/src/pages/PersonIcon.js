// src/PersonIcon.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const PersonIcon = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login');
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer', fontSize: '24px' }}>
      <FontAwesomeIcon icon={faUser} />
    </div>
  );
};

export default PersonIcon;
