type Window = { open: string; close: string };
export type Opening = {
  mon: Window[]; tue: Window[]; wed: Window[];
  thu: Window[]; fri: Window[]; sat: Window[]; sun: Window[];
};

const key = (d: number): keyof Opening =>
  (["sun","mon","tue","wed","thu","fri","sat"][d] as keyof Opening);

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export function isOpenNow(opening: Opening, now = new Date()) {
  const windows = opening[key(now.getDay())];
  const nowM = now.getHours() * 60 + now.getMinutes();
  for (const w of windows) {
    const s = toMin(w.open), e = toMin(w.close);
    if (s <= nowM && nowM <= e) return { open: true, closesInMins: e - nowM };
  }
  return { open: false as const };
}