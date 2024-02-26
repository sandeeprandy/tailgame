// NameInput.js

import React, { useState, useEffect } from 'react';

const NameInput = ({ onNameSubmit }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setName(storedName);
      onNameSubmit(storedName);
    }
  }, [onNameSubmit]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = () => {
    if (name.trim() !== '') {
      localStorage.setItem('userName', name);
      onNameSubmit(name);
    }
  };

  return (
    <div>
      <label htmlFor="name">Enter Your Name:</label>
      <input type="text" id="name" value={name} onChange={handleNameChange} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default NameInput;
