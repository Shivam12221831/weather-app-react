import { createContext } from "react";
import type { FavoritesContextType} from '../types/favoritesType';

export const FavoritesContext = createContext<FavoritesContextType | null>(null);