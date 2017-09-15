import React from 'react';
import { getAuth } from 'lib/auth';

const Header = () => {
  const { email } = getAuth();
  return (
    <div className="Header">
      <span className="Header--Link">
        {email.split('@')[0]}
      </span>
    </div>
  );
}

export default Header;
