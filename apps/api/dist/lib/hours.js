const key = (d) => ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][d];
const toMin = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
};
export function isOpenNow(opening, now = new Date()) {
    const windows = opening[key(now.getDay())];
    const nowM = now.getHours() * 60 + now.getMinutes();
    for (const w of windows) {
        const s = toMin(w.open), e = toMin(w.close);
        if (s <= nowM && nowM <= e)
            return { open: true, closesInMins: e - nowM };
    }
    return { open: false };
}
