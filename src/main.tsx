import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeProvider.tsx';
import { FavoritesProvider } from './context/FavoritesProvider.tsx';
import { Toaster } from "sonner";
import { RecentsProvider } from './context/RecentsProvider.tsx';

createRoot(document.getElementById('root')!).render(
    <ThemeProvider>
        <FavoritesProvider>
            <RecentsProvider>
                <App />
                <Toaster richColors position="top-center" duration={2000}/>
            </RecentsProvider>
        </FavoritesProvider>
    </ThemeProvider>
)