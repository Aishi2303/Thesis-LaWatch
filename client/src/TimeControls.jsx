const TimeControls = ({ year, setYear }) => {
  const years = [2023, 2024, 2025];

  return (
    <div className="time-controls">
      <h4>Year</h4>
      <div className="year-buttons">
        {years.map(y => (
          <button
            key={y}
            className={year === y ? 'active' : ''}
            onClick={() => setYear(y)}
          >
            {y}
          </button>
        ))}
      </div>
    </div>
  );
};