import { useState } from 'react';
import MCQ from './components /MCQQuestion'
import './App.css';


const PROMPT_SUFFIX = `and output the entire result as a single JSON array where each question object MUST contain the fields: "type" (value must be "mcq"), "question", "options" (an array of strings), and "answer" (the correct option string).`;



const parseQuestions = (rawText) => {
  try {
    // Attempt to find the JSON content (starts with [ and ends with ])
    const jsonMatch = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);

    let jsonString = rawText;
    if (jsonMatch) {
      // If a JSON array is found, use that part
      jsonString = jsonMatch[0];
    }

    const parsed = JSON.parse(jsonString);
    
    // Ensure the parsed result is an array and add unique IDs
    if (!Array.isArray(parsed)) {
      throw new Error("Parsed content is not a valid JSON array.");
    }
    
    return parsed.map((q, index) => ({
      ...q,
      id: q.id || index + 1, // Use existing ID or assign new one
    }));

  } catch (e) {
    console.error("JSON Parsing Error:", e);
    throw new Error("Invalid JSON format. Please check the structure.");
  }
};


function App() {
  const [rawText, setRawText] = useState(''); 
  const [questions, setQuestions] = useState([]); 
  const [answers, setAnswers] = useState({}); 
  const [results, setResults] = useState({});
  const [promptCopyStatus, setPromptCopyStatus] = useState(null); 

  // --- Copy Handlers ---
  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(PROMPT_SUFFIX);
      setPromptCopyStatus('Copied!');
    } catch (err) {
      setPromptCopyStatus('Failed to copy!');
    }
    setTimeout(() => setPromptCopyStatus(null), 2000);
  };
  
 
  // ----------------------

  // --- Quiz Logic ---
  const loadQuestions = () => {
    try {
      const parsed = parseQuestions(rawText);
      setQuestions(parsed);
      setAnswers({}); 
      setResults({}); 
      if (parsed.length === 0) {
        alert("Could not find any questions. Please check the format!");
      }
    } catch (e) {
      alert(e.message);
    }
  };
  
  const handleSelect = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const checkAnswers = () => {
    const newResults = {};
    questions.forEach((q) => {
      newResults[q.id] = answers[q.id] === q.answer;
    });
    setResults(newResults);
  };
  // --------------------

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>GPT Exam Generator</h1>
      
     
      <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px', marginBottom: '20px', background: '#f9f9f9' }}>
        <h3>Step 1: Get Questions from ChatGPT</h3>
        <p>1. Type your request (e.g., "Generate 5 MCQs about Python").</p>
        <p>2.add this to the end of your request:</p>

        <pre style={{ background: '#e0f7fa', border: '1px solid #00bcd4', padding: '10px', overflowX: 'auto', fontSize: '14px', fontFamily: 'monospace', margin: '10px 0' }}>
          {PROMPT_SUFFIX}
        </pre>
        
      
        <button 
          onClick={handleCopyPrompt} 
          style={{ padding: '8px 15px', cursor: 'pointer', backgroundColor: '#00bcd4', color: 'white', border: 'none' }}
        >
          {promptCopyStatus || 'Copy'}
        </button>

      </div>

   
      <div style={{ marginBottom: '30px' }}>
        <h3>Step 2: Paste it here !</h3>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste the complete JSON array from the GPT here..."
          style={{ width: '100%', height: '150px', marginBottom: '10px', padding: '10px', fontFamily: 'monospace' }}
        />
        <button onClick={loadQuestions} style={{ padding: '10px 20px', fontWeight: 'bold' }}>
          Start !!!
        </button>
      </div>

      <hr />
      
      {questions.length > 0 ? (
        <>
          <h2>You have {questions.length} Questions , LETS GOO</h2>
          {questions.map((q) => (
            <div key={q.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
              <MCQ 
                question={q}
                selected={answers[q.id]}
                onSelect={(option) => handleSelect(q.id, option)}
              />
              
              {results[q.id] !== undefined && (
                <p style={{ fontWeight: 'bold', marginTop: '10px' }}>
                  {results[q.id] ? "GOOD JOB BROO" : ` Actually the Correct Answer is : ${q.answer} `}
                </p>
              )}
            </div>
          ))}

          <button onClick={checkAnswers}>
            Check your answers!
          </button>
        </>
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default App;