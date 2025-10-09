import { useLocalStorage } from "./useLocalStorage";
export function useFavourites() {
    const [favs, setFavs] = useLocalStorage("favs", []);
    const toggleFav = (id) => setFavs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    const isFav = (id) => favs.includes(id);
    return { favs, isFav, toggleFav };
}
