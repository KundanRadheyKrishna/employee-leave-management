import React, { useState } from "react";
import useAuthStore from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { account, tablesDB, DB_ID, USER_TABLE_ID } from "../../appwriteConfig";

const LoginForm = () => {
  const closeLogin = useAuthStore((s)=> s.closeLogin);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handlsubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Fill All Fields");
      return;
    }

    try {
      // 🔥 old session delete
      // try {
      //   await account.deleteSession("current");
      // } catch {
      //   console.log("no active session");
      // }

      // 🔥 login
      await account.createEmailPasswordSession(email, password);

      const user = await account.get();

      // 🔥 ROLE FETCH (NO CREATE)
      const userRow = await tablesDB.getRow(
        DB_ID,
        USER_TABLE_ID,
        user.$id
      );

      const role = userRow.role;

      // 🔥 store user
      setUser({
        id: user.$id,
        email: user.email,
        role,
      });

      setEmail("");
      setPassword("");

      // 🔥 NAVIGATION BASED ON ROLE
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "employee") {
        navigate("/employee-dashboard");
      } else if (role === "hod") {
        navigate("/hod-dashboard");
      } else if (role === "vc") {
        navigate("/vc-dashboard");
      } else {
        alert("Invalid role");
        navigate("/");
      }

      console.log("login success");

    } catch (error) {
      console.log("Login error:", error);

      // ❌ agar DB me row nahi mila
      alert("User not found in database. Contact admin.");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="w-`w-87.5` p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white">
        <h2 className="text-2xl font-semibold text-center mb-6">sign in</h2>

        <form onSubmit={handlsubmit} autoComplete="off">
          <div className="mb-4">
            <label className="text-sm text-gray-300">Email</label>
            <input
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              type="email"
              placeholder="Enter email"
              className="w-full mt-1 p-2 rounded-md bg-white/10 border border-white/20 outline-none text-white"
            />
          </div>

          <div className="mb-4 relative">
            <label className="text-sm text-gray-300">Password</label>
            <input
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
              type={show ? "text" : "password"}
              placeholder="Enter password"
              className="w-full mt-1 p-2 rounded-md bg-white/10 border border-white/20 outline-none text-white"
            />
            <button
              type="button"
              onClick={()=> setShow(!show)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-black"
            >
              x
            </button>
          </div>

          <div className="flex gap-3 mt-5">
            <button type="submit" className="flex-1 bg-green-600 py-2 rounded-md">
              sign in
            </button>

            <button type="button" onClick={closeLogin} className="flex-1 bg-red-600 py-2 rounded-md">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;