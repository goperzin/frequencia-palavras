import { render, screen } from '@testing-library/react';
import { ErrorMessage } from '../src/components/ErrorMessage/ErrorMessage';

describe('ErrorMessage', () => {
  it('renders nothing when message is null', () => {
    const { container } = render(<ErrorMessage message={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the message text when provided', () => {
    render(<ErrorMessage message="erro de teste" />);
    expect(screen.getByText('erro de teste')).toBeInTheDocument();
  });

  it('has role="alert" when message is present', () => {
    render(<ErrorMessage message="erro de teste" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
