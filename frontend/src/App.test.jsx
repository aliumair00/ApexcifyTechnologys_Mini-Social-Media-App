import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
    it('renders without crashing', () => {
        render(<App />);
        // Since we don't know exactly what's in App, we just check if it renders.
        // You might want to look for a specific element if you know one exists, e.g.:
        // expect(screen.getByText(/Mini Social Media App/i)).toBeInTheDocument();
    });
});
