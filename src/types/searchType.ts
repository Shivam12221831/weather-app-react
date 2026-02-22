export type SearchProps = {
    onSearch: (city: string) => void;
    placeholderText: string;
    type: string;
}

export type SuggestionsType = {
    name: string,
    country: string,
    state?: string
}