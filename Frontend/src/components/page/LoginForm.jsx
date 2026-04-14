// import React, { useState } from "react";
// import useAuthStore from "../../store/authStore";
// import { useNavigate } from "react-router-dom";
// import {account ,  tablesDB, DB_ID, databases,USER_TABLE_ID } from "../../appwriteConfig"
// import { TablesDB } from "appwrite";

// const LoginForm = () => {
//   const closeLogin = useAuthStore((s)=> s.closeLogin);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("")
//   const [show, setShow] = useState(false)

//   const {setUser} = useAuthStore();
//   const navigate =  useNavigate();

//   const handlsubmit = async (e)=>{
//     e.preventDefault();
//      if (!email || !password) {
//     alert("Fill All Fields");
//     return; // ❗ compulsory
//   }

//     try {
//       try{
//       await account.deleteSession("current")
//       } catch (error) {
//         console.log("no active session")
//       }
//       await account.createEmailPasswordSession(
//         email,
//         password
//       );

//       const user = await account.get();
//       let role = null;
//       try {
//         const userDoc = await databases.getDocument(
//         DB_ID,
//         USER_TABLE_ID,
//         user.$id
//       );
//       role = userDoc.role;

//       } catch (err){
//         console.log ("User doc missing",err);
//         alert("role fectjddd")
//         // role = null // fallback safe default
//       }
      

//       setUser({
//       id: user.$id,
//       email: user.email,
//       role,
//      });

//     //  closeLogin();
// setEmail("");
//     setPassword("");
//       if(role === "admin"){
//         navigate("/admin-dashboard")
//       } else if(role=== "employee"){
//         navigate("/employee-dashboard")
//       } else if(role=== "hod"){
//         navigate("/hod-dashboard")
//       } else if(role==="vc"){
//         navigate("/vc-dashboard")
//       } else {
//         navigate("/")
//       }
//       console.log("login succes")
//     } catch (error){
//       console.log("Navigation error:", error);
//     }

//   }

//   return (
//     <div className="h-screen w-full flex items-center justify-center bg-black/20 backdrop-blur-sm">
//       <div
//         className="w-`w-87.5` p-6 rounded-2xl 
//                       bg-white/10 backdrop-blur-xl 
//                       border border-white/20 
//                       shadow-2xl text-white"
//       >
//         <h2 className="text-2xl font-semibold text-center mb-6">sign in</h2>

//         <form onSubmit={handlsubmit} autoComplete="off">
//           <div className="mb-4">
//             <label className="text-sm text-gray-300">Email</label>
//             <input
//             autoComplete="off"
//             name="email"
//               value={email}
//               onChange={(e)=>setEmail(e.target.value)}
//               type="email"
//               placeholder="Enter email"
//               className="w-full mt-1 p-2 rounded-md 
//                        bg-white/10 border border-white/20 
//                        outline-none text-white placeholder-gray-400"
//             />
//           </div>

//           <div className="mb-4 relative">
//             <label className="text-sm text-gray-300">Password</label>
//             <input
//               autoComplete="off"
//               name="password"
//               value={password}
//               onChange={(e)=> setPassword(e.target.value)}
//               type={show? "text":"password"}
//               placeholder="Enter password"
//               className="w-full mt-1 p-2 rounded-md 
//                        bg-white/10 border border-white/20 
//                        outline-none text-white placeholder-gray-400"
//             />
//             <button
//             type="button"
//             onClick={(e)=> setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/12 text-black">x</button>
//           </div>

//           <div className="flex gap-3 mt-5">
//             <button
//              type="submit"
//              className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-md transition">
//               sign in
//             </button>

//             <button
//             type="button"
//             onClick={closeLogin}
//              className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-md transition">
//               Cancel
//             </button>
//           </div>

//           <p className="text-sm text-center mt-4 text-blue-400 hover:underline cursor-pointer">
//             Forgot Password?
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginForm;

import React, { useState } from "react";
import useAuthStore from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { account, tablesDB, DB_ID, USER_TABLE_ID } from "../../appwriteConfig";

const LoginForm = () => {
  const closeLogin = useAuthStore((s)=> s.closeLogin);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)

  const {setUser} = useAuthStore();
  const navigate =  useNavigate();

  const handlsubmit = async (e)=>{
    e.preventDefault();

    if (!email || !password) {
      alert("Fill All Fields");
      return;
    }

    try {
      // delete old session
      try{
        await account.deleteSession("current")
      } catch {
        console.log("no active session")
      }

      // login
      await account.createEmailPasswordSession(email, password);

      const user = await account.get();

      let role = null;

      try {
        // ✅ try to fetch row
        const userRow = await tablesDB.getRow(
          DB_ID,
          USER_TABLE_ID,
          user.$id
        );

        role = userRow.role;

      } catch (err){
        console.log("Row not found → creating new one");

        // ✅ create row if not exists
        const newRow = await tablesDB.createRow(
          DB_ID,
          USER_TABLE_ID,
          user.$id,
          {
            name: user.name || "No Name",   // ✅ FIX
            email: user.email,
            // role: "employee" // default role
          }
        );

        role = newRow.role;
      }

      // store user
      setUser({
        id: user.$id,
        email: user.email,
        role,
      });

      setEmail("");
      setPassword("");

      // navigation
      if(role === "admin"){
        navigate("/admin-dashboard")
      } else if(role=== "employee"){
        navigate("/employee-dashboard")
      } else if(role=== "hod"){
        navigate("/hod-dashboard")
      } else if(role==="vc"){
        navigate("/vc-dashboard")
      } else {
        navigate("/")
      }

      console.log("login success")

    } catch (error){
      console.log("Navigation error:", error);
    }
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div
        className="w-`w-87.5` p-6 rounded-2xl 
                      bg-white/10 backdrop-blur-xl 
                      border border-white/20 
                      shadow-2xl text-white"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">sign in</h2>

        <form onSubmit={handlsubmit} autoComplete="off">
          <div className="mb-4">
            <label className="text-sm text-gray-300">Email</label>
            <input
              autoComplete="off"
              name="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              type="email"
              placeholder="Enter email"
              className="w-full mt-1 p-2 rounded-md 
                       bg-white/10 border border-white/20 
                       outline-none text-white placeholder-gray-400"
            />
          </div>

          <div className="mb-4 relative">
            <label className="text-sm text-gray-300">Password</label>
            <input
              autoComplete="off"
              name="password"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
              type={show? "text":"password"}
              placeholder="Enter password"
              className="w-full mt-1 p-2 rounded-md 
                       bg-white/10 border border-white/20 
                       outline-none text-white placeholder-gray-400"
            />
            <button
              type="button"
              onClick={()=> setShow(!show)}
              className="absolute right-2 top-1/2 -translate-y-1/12 text-black"
            >
              x
            </button>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-md transition">
              sign in
            </button>

            <button
              type="button"
              onClick={closeLogin}
              className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-md transition">
              Cancel
            </button>
          </div>

          <p className="text-sm text-center mt-4 text-blue-400 hover:underline cursor-pointer">
            Forgot Password?
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;