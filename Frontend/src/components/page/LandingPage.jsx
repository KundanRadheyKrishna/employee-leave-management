import React from "react";
import Navbar from "../common/Navbar";
import LoginForm from "./LoginForm";
import heroImg from "../../assets/hero.png";
import useAuthStore from "../../store/authStore";

const LandingPage = () => {
  const showLogin = useAuthStore((state) => state.showLogin);
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {showLogin && <div className="fixed inset-0 z-50"><LoginForm /></div>}
      <main>
        <section id="home" className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-6 pb-20 pt-28 md:flex-row">
          <div className="flex-1">
            <p className="font-semibold text-green-700">Organization leave management</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-900 md:text-6xl">Simple, accountable leave approvals.</h1>
            <p className="mt-6 max-w-xl text-lg text-slate-600">One secure workflow for employees, HODs, VCs and administrators, with working-day rules and role-based access.</p>
          </div>
          <img src={heroImg} alt="Leave management illustration" className="w-full max-w-md" />
        </section>
        <section id="features" className="bg-slate-100 px-6 py-16">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
            {[
              ["Role-based approval", "Employee → HOD → VC, with each role seeing only its authorized queue."],
              ["Accurate leave rules", "Casual, Sick, Earned and Half Day leave with weekends excluded."],
              ["Audit-friendly history", "Immutable requests, unread notifications and clear approval status."],
            ].map(([title, text]) => <article key={title} className="rounded-xl bg-white p-6 shadow-sm"><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm text-slate-600">{text}</p></article>)}
          </div>
        </section>
      </main>
      <footer id="footer" className="bg-slate-950 p-6 text-center text-sm text-white">Employee Leave Management System</footer>
    </div>
  );
};

export default LandingPage;
