export type TBRItem = {
    id: string;
    title: string;
    image: string;
    gallery: string[];
    genre: string[];
    rating: number | null; // null if not rated yet
    status: "TBR" | "Reading" | "Watching" | "Completed";
    category: "Book" | "Anime" | "Manga";
    notes?: string;
    dateAdded: string;
};
