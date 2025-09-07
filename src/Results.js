import React from "react";
import Phonetic from "./Phonetic";
import Meaning from "./Meaning";

export default function Results({ results }) {
  if (!results) return null; // nothing to show yet

  const word = results.word || "";
  const phonetics = Array.isArray(results.phonetics) ? results.phonetics : [];
  const meanings  = Array.isArray(results.meanings)  ? results.meanings  : [];

  // some entries provide a single "phonetic" string too
  const phoneticText =
    results.phonetic ||
    (phonetics.find(p => p && p.text)?.text ?? "");

  return (
    <div className="Results">
      {word && <h2>{word}</h2>}
      {phoneticText && <div className="phonetic-text">{phoneticText}</div>}

      {/* render audio/text chips safely */}
      {phonetics.map((p, i) =>
        (p?.audio || p?.text) ? <Phonetic key={`${p.audio || p.text || i}-${i}`} phonetic={p} /> : null
      )}

      {/* meanings & definitions */}
      {meanings.map((m, i) => (
        <Meaning key={i} meaning={m} />
      ))}
    </div>
  );
}
