import React, {useEffect,useState} from "react";
import { supabase } from "./supabase";

export default function History() {
  const [data,setData]=useState<any[]>([]);
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if(!session) return;
      supabase.from('results').select('*').eq('user_id',session.user.id).order('created_at',{ascending:false})
        .then(({data})=>setData(data||[]));
    });
  },[]);
  return (
    <div>
      <h2>History</h2>
      {data.map((r,i)=>(
        <div key={i}>
          <p>{new Date(r.created_at).toLocaleString()}</p>
          {r.photo_url && <img src={r.photo_url.replace('/object/','/object/public/')} width={150}/>}
          <pre>{r.gpt_result}</pre>
        </div>
      ))}
    </div>
  );
}
