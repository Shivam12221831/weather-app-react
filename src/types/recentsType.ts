export type RecentsContextType = {
    recents: string[],
    addRecentCity: (city: string) => void,
    clearRecents: () => void;
}