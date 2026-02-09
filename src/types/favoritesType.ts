export type FavoritesContextType = {
    favs: string[];
    isFavorite: (city: string) => boolean;
    addFavorite: (city: string) => void;
    removeFavorite: (city: string) => void;
}