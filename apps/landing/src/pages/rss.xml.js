import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

import { THEME } from "../styles/theme";
import { sortByDateDesc } from "../lib/blog";

export async function GET(context) {
  const posts = sortByDateDesc(await getCollection("blog"));

  return rss({
    title: THEME.name,
    description: `Latest articles from the ${THEME.name} blog.`,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
      author: post.data.author,
    })),
    customData: `<language>en-us</language>`,
  });
}
