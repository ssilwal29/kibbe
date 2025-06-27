import React, {useState} from "react";
import { supabase } from "./supabase";

export default function Auth({ onAuth }: { onAuth:any }) {
  const [email,setEmail]=useState(""),[pw,setPw]=useState(""),[signUp,setSign]=useState(false);
  const handle=async()=>{
    const fn = signUp? supabase.auth.signUp : supabase.auth.signInWithPassword;
    const { data, error } = await fn({ email, password:pw });
    if(error) alert(error.message); else onAuth(data.session);
  };
  return (
    <div className="flex space-x-2 items-center">
      <input
        placeholder="email"
        onChange={e => setEmail(e.target.value)}
        className="px-3 py-2 border rounded"
      />
      <input
        type="password"
        placeholder="pw"
        onChange={e => setPw(e.target.value)}
        className="px-3 py-2 border rounded"
      />
      <button
        onClick={handle}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {signUp ? "Sign Up" : "Login"}
      </button>
      <button
        onClick={() => setSign(!signUp)}
        className="underline text-sm"
      >
        {signUp ? "Have account?" : "New user?"}
      </button>
    </div>
  );
}
