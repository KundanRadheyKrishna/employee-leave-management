import React, { useState } from 'react';
import logo from "../../assets/logo.png"; // correct relative path
import LoginButton from './LoginButton';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md w-full z-20 top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="">
            <img src={logo} alt="logo"  className='w-32 h-32 object-fit'/>
          </div>


          {/* Desktop Menu */}
          <div className="md:flex space-x-8 items-center">
            <LoginButton/>

          </div>          
        </div>
      </div>

    </nav>
  );
}

export default Navbar;