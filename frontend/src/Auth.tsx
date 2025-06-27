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
    <div className="flex space-x-2">
      <input placeholder="email" onChange={e=>setEmail(e.target.value)}/>
      <input type="password" placeholder="Password" onChange={e=>setPw(e.target.value)}/>
      <button onClick={handle}>{signUp?"Sign Up":"Login"}</button>
      <button onClick={()=>setSign(!signUp)} className="underline text-sm">
        {signUp?"Have account?":"New user?"}
      </button>
    </div>
  );
}
