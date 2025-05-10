import React, { useState, useEffect } from 'react';
import { mood_logger_backend } from 'declarations/mood_logger_backend';
import './index.scss';

function App() {
  const [emoji, setEmoji] = useState('😊');
  const [stats, setStats] = useState([]);
  const [error, setError] = useState('');

  const isEmoji = (str) => {
    // Regex sederhana untuk deteksi emoji (tidak sempurna, tapi cukup baik)
    return /^[\p{Emoji}]{1}$/u.test(str);
  };

  const fetchStats = async () => {
    const res = await mood_logger_backend.getMoodStats();
    setStats(res);
  };

  const submitMood = async () => {
    if (!isEmoji(emoji)) {
      setError('Please enter a single emoji only!');
      return;
    }
    setError('');
    await mood_logger_backend.logMood(emoji);
    fetchStats();
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="mood-container">
      <h1>Mood Logger</h1>
      <div className="input-group">
        <input
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          placeholder="Enter emoji"
          maxLength={2} // Batas 2 karakter (beberapa emoji terdiri dari 2 kode)
        />
        <button onClick={submitMood}>Log Mood</button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="cloud">
        {stats.map(([e, count]) => {
          const size = 12 + Number(count) * 5;
          return (
            <span
              key={e}
              style={{ fontSize: `${size}px` }}
              className="cloud-emoji"
            >
              {e}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default App;
