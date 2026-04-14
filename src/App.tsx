import { useState } from 'react';
import { analyzeFrequency, WordEntry } from './lib/analyzeFrequency';
import { TextInputSection } from './components/TextInputSection/TextInputSection';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { FrequencyTable } from './components/FrequencyTable/FrequencyTable';
import styles from './App.module.css';

const MAX_CHARS = 2048;

export function App() {
  const [inputText, setInputText] = useState('');
  const [entries, setEntries] = useState<WordEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleAnalyze() {
    if (inputText.trim() === '') {
      setError('Digite um texto para analisar.');
      return;
    }

    const result = analyzeFrequency(inputText);

    if (result.length === 0) {
      setError('Nenhuma palavra encontrada no texto.');
      return;
    }

    setEntries(result);
    setError(null);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Frequência de Palavras</h1>
      <TextInputSection
        value={inputText}
        onChange={setInputText}
        onSubmit={handleAnalyze}
        maxLength={MAX_CHARS}
      />
      <ErrorMessage message={error} />
      <FrequencyTable entries={entries} />
    </div>
  );
}
