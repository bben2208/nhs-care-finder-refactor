import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useFavourites } from "./hooks/useFavourites";
import { usePlacesSearch } from "./hooks/usePlacesSearch";
import useFiltersAndSort from "./hooks/useFiltersAndSort";
import { useDirectionsUrl } from "./hooks/useDirectionsUrl";
import { useThemeTokens } from "./hooks/useThemeTokens";
import Layout from "./components/Layout";
import SearchForm from "./components/SearchForm";
import Tabs from "./components/Tabs";
import BigMap from "./components/BigMap";
import ResultList from "./components/ResultList";
// Chatbot feature (default export from folder)
import { Chatbot } from "./features/chatbot";
export default function App() {
    const [searchParams] = useSearchParams();
    // persisted prefs
    const [postcode, setPostcode] = useLocalStorage("pc", "BN21");
    const [type, setType] = useLocalStorage("type", "");
    const [radius, setRadius] = useLocalStorage("rad", 10);
    const [dark, setDark] = useLocalStorage("dark", false);
    const [filters, setFilters] = useState({ open: false, wheelchair: false, parking: false, xray: false, fav: false });
    const [tab, setTab] = useState("list");
    const [sortBy, setSortBy] = useState("nearest");
    const { isFav, toggleFav } = useFavourites();
    const { loading, results, error, expandedId, setExpandedId, searchByPostcode, searchByCoords } = usePlacesSearch();
    const { toDirections } = useDirectionsUrl();
    const { bg, fg, sub, card, border } = useThemeTokens(dark);
    // seed state from URL on first load
    useEffect(() => {
        const pc = searchParams.get("postcode");
        const ty = searchParams.get("type");
        const radStr = searchParams.get("radius");
        if (pc)
            setPostcode(pc);
        if (ty !== null)
            setType(ty);
        if (radStr) {
            const r = Number(radStr);
            if (!Number.isNaN(r) && r > 0)
                setRadius(r);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onSearch = (e) => {
        e.preventDefault();
        searchByPostcode(postcode, radius, type || undefined);
    };
    const useMyLocation = () => {
        if (!navigator.geolocation)
            return;
        navigator.geolocation.getCurrentPosition((pos) => searchByCoords(pos.coords.latitude, pos.coords.longitude, radius, type || undefined), () => { });
    };
    const filteredSorted = useFiltersAndSort(results, filters, sortBy, isFav);
    return (_jsxs(Layout, { dark: dark, toggleDark: () => setDark(d => !d), fg: fg, border: border, bg: bg, children: [_jsx(SearchForm, { postcode: postcode, setPostcode: setPostcode, type: type, setType: setType, radius: radius, setRadius: setRadius, filters: filters, setFilters: setFilters, sortBy: sortBy, setSortBy: setSortBy, loading: loading, onSearch: onSearch, useMyLocation: useMyLocation, border: border, card: card, fg: fg, sub: sub, dark: dark }), _jsx(Tabs, { value: tab, onChange: setTab, border: border, card: card, fg: fg }), tab === "list" ? (_jsx(ResultList, { results: filteredSorted, loading: loading, error: error || undefined, expandedId: expandedId, setExpandedId: setExpandedId, isFav: isFav, toggleFav: toggleFav, toDirections: toDirections, border: border, card: card, fg: fg, sub: sub, dark: dark })) : (_jsx("div", { style: { marginTop: 16, height: 420, borderRadius: 12, overflow: "hidden", border: `1px solid ${border}` }, children: _jsx(BigMap, { results: filteredSorted }) })), _jsx("p", { style: { fontSize: 12, color: sub, marginTop: 20 }, children: "Info only \u2014 not medical advice. In emergencies call 999. For advice use NHS 111 online." }), _jsx(Chatbot, { border: border, card: card, fg: fg, sub: sub })] }));
}
