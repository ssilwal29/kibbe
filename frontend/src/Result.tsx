import React from "react";
export default function Result({ result }: any) {
  const markdown = `## My Kibbe AI Result

**Type:** ${result.analysis.split("\n")[0]}

**Style Guide:**
${result.style}

*Generated with Kibbe AI*`;
  const share = () => {
    const url = `https://www.reddit.com/r/FemaleFashionAdvice/submit?title=${encodeURIComponent("My Kibbe AI Result")}&text=${encodeURIComponent(markdown)}`;
    window.open(url, "_blank");
  };
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Your Analysis</h2>
      <pre className="whitespace-pre-wrap mb-4">{result.analysis}</pre>
      <h3 className="font-semibold mb-2">Style Guide</h3>
      <pre className="whitespace-pre-wrap mb-4">{result.style}</pre>
      <div className="space-x-2">
        <button
          onClick={() => navigator.clipboard.writeText(markdown)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Copy MD
        </button>
        <button onClick={share} className="px-4 py-2 border rounded">
          Share to Reddit
        </button>
      </div>
    </div>
  );
}
