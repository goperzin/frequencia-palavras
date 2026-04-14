import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../src/App';

describe('App', () => {
  it('renders textarea and button with no table on load', () => {
    render(<App />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /analisar/i })).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('shows error with role="alert" when submitting empty field', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /analisar/i }));
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Digite um texto para analisar.');
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('shows table and clears error when submitting valid text', async () => {
    render(<App />);
    await userEvent.type(screen.getByRole('textbox'), 'hello world hello');
    await userEvent.click(screen.getByRole('button', { name: /analisar/i }));
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows error when submitting punctuation-only text', async () => {
    render(<App />);
    await userEvent.type(screen.getByRole('textbox'), '!!! ??? ---');
    await userEvent.click(screen.getByRole('button', { name: /analisar/i }));
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Nenhuma palavra encontrada no texto.');
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('updates table when re-analyzing with new text', async () => {
    render(<App />);
    const textarea = screen.getByRole('textbox');

    await userEvent.type(textarea, 'foo foo foo');
    await userEvent.click(screen.getByRole('button', { name: /analisar/i }));
    expect(screen.getByText('foo')).toBeInTheDocument();

    await userEvent.clear(textarea);
    await userEvent.type(textarea, 'bar bar');
    await userEvent.click(screen.getByRole('button', { name: /analisar/i }));
    expect(screen.getByText('bar')).toBeInTheDocument();
    expect(screen.queryByText('foo')).not.toBeInTheDocument();
  });

  it('shows "0 / 2048" on load and updates counter as user types', async () => {
    render(<App />);
    expect(screen.getByText('0 / 2048')).toBeInTheDocument();
    await userEvent.type(screen.getByRole('textbox'), 'hi');
    expect(screen.getByText('2 / 2048')).toBeInTheDocument();
  });
});
