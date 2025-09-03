import { z } from "zod";
export const PlacesQuery = z.object({
    query: z.object({
        postcode: z.string().optional(),
        lat: z.string().regex(/^-?\d+(\.\d+)?$/).optional(),
        lon: z.string().regex(/^-?\d+(\.\d+)?$/).optional(),
        type: z.enum(["gp", "walk-in", "utc", "ae"]).optional(),
        radius: z.string().regex(/^\d+$/).default("10")
    })
});
