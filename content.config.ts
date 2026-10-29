import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
	collections: {
		content: defineCollection({
			type: "page",
			source: "**",
		}),
		blog: defineCollection({
			type: "page",
			source: "blog/**.md",
			schema: z.object({
				title: z.string(),
				description: z.string(),
				date: z.coerce.date(),
				tags: z.array(z.string()),
				img: z.string().optional(),
			}),
		}),
		projects: defineCollection({
			type: "page",
			source: "projects/**.md",
			schema: z.object({
				title: z.string(),
				description: z.string(),
				date: z.coerce.date(),
				tags: z.array(z.string()),
				img: z.string().optional(),
			}),
		}),
	},
});
