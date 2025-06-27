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
      <h2>Your Analysis</h2>
      <pre>{result.analysis}</pre>
      <h3>Style Guide</h3>
      <pre>{result.style}</pre>
      <button onClick={()=>navigator.clipboard.writeText(markdown)}>Copy MD</button>
      <button onClick={share}>Share to Reddit</button>
    </div>
  );
}
