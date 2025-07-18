import { z } from "zod";

export const imagesIdsSchema = z.object({
    imagesIds: z.string().uuid().array().min(1)
});
