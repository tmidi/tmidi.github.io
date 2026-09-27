import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Published posts, newest first. */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

// The glob loader already uses the `slug` front matter (or the file name) as the entry id.
export const postUrl = (post: Post): string => `/blog/${post.id}/`;

export const tagSlug = (tag: string): string => tag.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export const tagUrl = (tag: string): string => `/tags/${tagSlug(tag)}/`;

export const isoDate = (date: Date): string => date.toISOString().slice(0, 10);
