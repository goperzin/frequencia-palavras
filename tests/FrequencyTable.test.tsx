import { render, screen } from '@testing-library/react';
import { FrequencyTable } from '../src/components/FrequencyTable/FrequencyTable';
import { WordEntry } from '../src/lib/analyzeFrequency';

describe('FrequencyTable', () => {
  it('renders nothing when entries is null', () => {
    const { container } = render(<FrequencyTable entries={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the table with headers when entries is an empty array', () => {
    render(<FrequencyTable entries={[]} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Palavra')).toBeInTheDocument();
    expect(screen.getByText('Frequência')).toBeInTheDocument();
  });

  it('renders one row per entry with word and count', () => {
    const entries: WordEntry[] = [
      { word: 'hello', count: 3 },
      { word: 'world', count: 1 },
    ];
    render(<FrequencyTable entries={entries} />);
    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('world')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders rows in the same order as the entries array', () => {
    const entries: WordEntry[] = [
      { word: 'banana', count: 5 },
      { word: 'apple', count: 3 },
      { word: 'cherry', count: 1 },
    ];
    render(<FrequencyTable entries={entries} />);
    const rows = screen.getAllByRole('row');
    // row[0] is the header
    expect(rows[1]).toHaveTextContent('banana');
    expect(rows[2]).toHaveTextContent('apple');
    expect(rows[3]).toHaveTextContent('cherry');
  });

  it('renders tbody with no rows when entries is empty', () => {
    render(<FrequencyTable entries={[]} />);
    const rows = screen.getAllByRole('row');
    // only the header row
    expect(rows).toHaveLength(1);
  });
});
