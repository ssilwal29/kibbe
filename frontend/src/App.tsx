import React, { useState, useEffect } from "react";
import Quiz from "./Quiz";
import Result from "./Result";
import Auth from "./Auth";
import History from "./History";
import { supabase } from "./supabase";
import axios from "axios";

export default function App() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [view, setView] = useState<'main' | 'history'>('main');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_e, session) => setSession(session));
  }, []);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoto(e.target.files?.[0] || null);
  };

  const handleQuizSubmit = async (quizAnswers: Record<string, string>) => {
    setAnswers(quizAnswers);
    if (!photo || !session?.user?.id) return alert("Please login and upload a photo.");
    const form = new FormData();
    form.append("file", photo);
    form.append("quiz_answers", JSON.stringify(quizAnswers));
    form.append("user_id", session.user.id);
    form.append("photo_filename", photo.name);

    const res = await axios.post("http://localhost:8000/analyze", form);
    setResult(res.data);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6">Kibbe Style Finder</h1>
      {!session ? (
        <Auth onAuth={setSession} />
      ) : (
        <>
          <div className="mb-6 space-x-4">
            <button
              onClick={() => setView('main')}
              className="text-sm text-blue-600 hover:underline"
            >
              Home
            </button>
            <button
              onClick={() => setView('history')}
              className="text-sm text-blue-600 hover:underline"
            >
              My History
            </button>
          </div>
          {view === 'main' && !result ? (
            <>
              <input type="file" onChange={handlePhoto} className="mb-4 block" />
              <Quiz onSubmit={handleQuizSubmit} />
            </>
          ) : view === 'main' ? (
            <Result result={result} />
          ) : (
            <History />
          )}
        </>
      )}
    </div>
);
}
