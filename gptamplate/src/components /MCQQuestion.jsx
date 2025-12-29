function MCQ({ question, selected, onSelect }) {





  return (
    <div style={{ marginBottom: "1.5rem" }}>

      <p><strong>{question.question}</strong></p>

      {question.options.map((option) => (
        <label key={option} style={{ display: "block" }}>
          <input
            type="radio"
            name={`q-${question.id}`}
            value={option}
            checked={selected === option}
            onChange={() => onSelect(option)}
          />

          {option}
        </label>
      ))}
    </div>
  );
}

export default MCQ;
