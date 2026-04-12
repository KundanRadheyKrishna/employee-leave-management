import React from "react";
// import useAuthStore from "../../store/authStore";

const LoginButton = ({onClick}) => {
  return (
    <div className=" flex items-center gap-4">
      <button
        onClick={()=>{
          console.log("cliked")
          onClick();
        }}
        className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition"
      >
        sign in
      </button>
    </div>
  );
};

export default LoginButton;
