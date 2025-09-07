import React, { useEffect, useState } from "react";
import axios from "axios";
import Results from "./Results";
import Photos from "./Photos";
import "./Dictionary.css";

export default function Dictionary({ defaultKeyword = "" }) {
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [results, setResults] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(Boolean(defaultKeyword?.trim()));

  useEffect(() => {
    const term = (defaultKeyword || "").trim();
    if (term) search(term);
  }, [defaultKeyword]);

  async function search(term) {
    if (!term) return;
    setError(null);
    setHasSearched(true);

    try {
      const dictUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term)}`;
      const { data } = await axios.get(dictUrl);
      setResults(Array.isArray(data) && data[0] ? data[0] : null);
    } catch {
      setResults(null);
      setError("Couldn’t load the definition. Try another word.");
    }

    try {
      const pexelsKey =
        process.env.REACT_APP_PEXELS_KEY ||
        "563492ad6f91700001000001fdd29f0808df42bd90c33f42e128fa89";
      const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(term)}&per_page=9`;
      const res = await axios.get(pexelsUrl, { headers: { Authorization: pexelsKey } });
      setPhotos(Array.isArray(res?.data?.photos) ? res.data.photos : []);
    } catch {
      setPhotos([]);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const term = keyword.trim();
    if (term) search(term);
  }

  function handleChange(e) {
    const val = e.target.value;
    setKeyword(val);
    if (!val.trim()) {
      setResults(null);
      setPhotos([]);
      setHasSearched(false);
      setError(null);
    }
  }

  const suggestions = ["sunset", "quick", "serendipity"];

  return (
    <div className="Dictionary">
      <section className="hero card">
        <h1>What word do you want to look up?</h1>

        <form className="search" onSubmit={handleSubmit}>
          <div className="input-wrap">
            <span className="icon" aria-hidden="true">
              {/* magnifier icon (no libs needed) */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <line x1="20" y1="20" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            <input
              className="field"
              type="search"
              value={keyword}
              onChange={handleChange}
              placeholder="Type a word…"
              autoFocus
            />
            <button className="btn" type="submit">Search</button>
          </div>
        </form>

        {!hasSearched && (
          <div className="suggestions">
            <span className="label">suggested:</span>
            <div className="chips">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="chip"
                  onClick={() => { setKeyword(s); search(s); }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {error && <div className="error">{error}</div>}
      {results && <Results results={results} />}
      {hasSearched && photos.length > 0 && <Photos photos={photos} />}
    </div>
  );
}
