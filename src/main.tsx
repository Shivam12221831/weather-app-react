import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeProvider.tsx';
import { FavoritesProvider } from './context/FavoritesProvider.tsx';

createRoot(document.getElementById('root')!).render(
    <ThemeProvider>
        <FavoritesProvider>
            <App />
        </FavoritesProvider>
    </ThemeProvider>
)