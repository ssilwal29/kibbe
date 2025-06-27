import React, { useState } from "react";
import quizData from "./quiz.json";

export default function Quiz({ onSubmit }: { onSubmit: (ans: Record<string,string>)=>void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string,string>>({});

  const q = quizData.questions[step];
  const next = (value: string) => {
    setAnswers({...answers, [q.id]: value});
    const ns = step+1;
    if(ns < quizData.questions.length) setStep(ns);
    else onSubmit({...answers, [q.id]: value});
  };

  return (
    <div>
      <h2 className="font-semibold">{q.question}</h2>
      <div className="flex space-x-2">
        {q.options.map((opt: any)=>
          <button key={opt.value} onClick={()=>next(opt.value)} className="border p-2">
            {opt.label}
          </button>
        )}
      </div>
    </div>
  );
}
