// import React, { useState } from "react";
// import { account, databases } from "./appwriteConfig";

// const DB_ID = import.meta.env.VITE_DB_ID;
// const USERS_COLLECTION = "USERS";
// const LEAVES_COLLECTION = "LEAVES";

// function App() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [user, setUser] = useState(null);
//   const [role, setRole] = useState("");

//   // 🔐 LOGIN
//   const login = async () => {
//     try {
//       // पहले logout (old session हटाओ)
//       try {
//         await account.deleteSession("current");
//       } catch {}

//       await account.createEmailPasswordSession(email, password);

//       const res = await account.get();
//       setUser(res);

//       // role fetch
//       const users = await databases.listDocuments(DB_ID, USERS_COLLECTION);

//       const current = users.documents.find(
//         (u) => u.email === res.email
//       );

//       setRole(current?.role || "no-role");

//       console.log("User:", res);
//       console.log("Role:", current?.role);

//       alert("Login success");
//     } catch (err) {
//       console.error(err);
//       alert("Login failed");
//     }
//   };

//   // 🚪 LOGOUT
//   const logout = async () => {
//     await account.deleteSession("current");
//     setUser(null);
//     setRole("");
//   };

//   // 📝 APPLY LEAVE
//   const applyLeave = async () => {
//     try {
//       await databases.createDocument(
//         DB_ID,
//         LEAVES_COLLECTION,
//         "unique()",
//         {
//           user_id: user.$id,
//           from_date: "2026-04-10",
//           to_date: "2026-04-12",
//           status: "pending",
//           current_level: "hod",
//           created_at: new Date().toISOString(),
//         }
//       );

//       alert("Leave Applied");
//     } catch (err) {
//       console.error(err);
//       alert("Leave failed");
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Leave Management System</h2>

//       {!user ? (
//         <>
//           <input
//             placeholder="Email"
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <br /><br />

//           <input
//             type="password"
//             placeholder="Password"
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <br /><br />

//           <button onClick={login}>Login</button>
//         </>
//       ) : (
//         <>
//           <h3>Welcome: {user.email}</h3>
//           <h4>Role: {role}</h4>

//           {role === "employee" && (
//             <button onClick={applyLeave}>Apply Leave</button>
//           )}

//           <br /><br />
//           <button onClick={logout}>Logout</button>
//         </>
//       )}
//     </div>
//   );
// }

// export default App;

import React from 'react'

const App = () => {
  return (
    <div>
      <h3>hello</h3>
    </div>
  )
}

export default App
