import React from "react";
import Navbar from "../common/Navbar";
import heroImg from "../../assets/hero.png"; 
import LoginButton from "../common/LoginButton";

const LandingPage = () => {
  return (
    <div className="pt-0 bg-white min-h-screen">
      
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="max-w-7xl mx-auto pb-0 px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Left Content */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Manage Employee Leave <br />
            Without Spreadsheets <br />
            Or Email Confusion
          </h1>

          <p className="mt-6 text-gray-600 text-lg mb-2">
            One system for Employees, HODs, and VCs to manage leave requests and approvals effortlessly.
          </p>

          <LoginButton/>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-center">
          <div className="relative">
            
            <div className="absolute -top-6 -right-6 w-72 h-72 bg-green-100 rounded-full blur-2xl"></div>

            <img
              src={heroImg}
              alt="hero"
              className="relative w-full max-w-md"
            />
          </div>
        </div>

      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-100 py-16  ">
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          <h2 className="text-3xl font-semibold text-gray-900 mb-10">
            Key Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-white p-6 rounded-xl shadow-sm transform transition duration-300 hover:scale-105">
              <h3 className="text-xl font-semibold mb-2">
                Role-Based Access
              </h3>
              <p className="text-gray-600">
                Separate dashboards for Employees, HODs, VCs, and Admin.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm transform transition duration-300 hover:scale-105">
              <h3 className="text-xl font-semibold mb-2">
                Streamlined Approval Process
              </h3>
              <p className="text-gray-600">
                Leave requests are handled efficiently with clear role-based actions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm transform transition duration-300 hover:scale-105">
              <h3 className="text-xl font-semibold mb-2">
                Leave Tracking
              </h3>
              <p className="text-gray-600">
                Track status, history, and approvals in one place.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="bg-gray-900 text-white text-center py-6">
        <p className="text-sm">
          © 2026 Employee Leave Management System. All rights reserved.
        </p>
      </footer>

    </div>
  );
};

export default LandingPage;