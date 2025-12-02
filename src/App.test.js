import { render, screen } from '@testing-library/react';
import App from './App';

test('renders landing page call to action link', () => {
  render(<App />);
  const ctaLink = screen.getByRole('link', { name: /reservar turno/i });
  expect(ctaLink).toBeInTheDocument();
});
