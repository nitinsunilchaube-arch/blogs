const POSTS_KEY = 'blog_posts';
const PASSWORD_KEY = 'blog_admin_password';

// ──────────────────────────────────────────
// Password helpers
// ──────────────────────────────────────────
export function setPassword(password) {
  localStorage.setItem(PASSWORD_KEY, password);
}

export function checkPassword(password) {
  const stored = localStorage.getItem(PASSWORD_KEY);
  return stored === password;
}

export function hasPassword() {
  return Boolean(localStorage.getItem(PASSWORD_KEY));
}

// ──────────────────────────────────────────
// Post helpers
// ──────────────────────────────────────────
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function getAllPosts() {
  try {
    const data = localStorage.getItem(POSTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function savePosts(posts) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

// ──────────────────────────────────────────
// CRUD
// ──────────────────────────────────────────

/** Fetch all posts. If `publishedOnly` is true, filter out drafts. */
export function fetchPosts(publishedOnly = false) {
  let posts = getAllPosts();
  if (publishedOnly) {
    posts = posts.filter((p) => p.status === 'published');
  }
  return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/** Fetch a single post by id. Returns null if not found (or if draft & publishedOnly). */
export function fetchPost(id, publishedOnly = false) {
  const posts = getAllPosts();
  const post = posts.find((p) => p.id === id);
  if (!post) return null;
  if (publishedOnly && post.status !== 'published') return null;
  return post;
}

/** Create a new post. Returns the created post object. */
export function createPost({ title, content, excerpt, tags, coverImage, status }) {
  const posts = getAllPosts();
  const now = new Date().toISOString();
  const id = generateId();

  const post = {
    id,
    title,
    content,
    excerpt: excerpt || stripHtml(content).substring(0, 160) + '...',
    tags: tags || [],
    coverImage: coverImage || '',
    status: status || 'published',
    createdAt: now,
    updatedAt: now,
  };

  posts.unshift(post);
  savePosts(posts);
  return post;
}

/** Update an existing post. Returns the updated post object. */
export function updatePost(id, { title, content, excerpt, tags, coverImage, status }) {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Post not found');

  const existing = posts[index];
  const updated = {
    ...existing,
    title,
    content,
    excerpt: excerpt || stripHtml(content).substring(0, 160) + '...',
    tags: tags || [],
    coverImage: coverImage || '',
    status: status ?? existing.status,
    updatedAt: new Date().toISOString(),
  };

  posts[index] = updated;
  savePosts(posts);
  return updated;
}

/** Delete a post by id. */
export function deletePost(id) {
  const posts = getAllPosts();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) throw new Error('Post not found');
  savePosts(filtered);
}

/** Export all posts as a JSON string (for backup). */
export function exportData() {
  return JSON.stringify(getAllPosts(), null, 2);
}

/** Import posts from a JSON string (merges / replaces). */
export function importData(jsonString) {
  const incoming = JSON.parse(jsonString);
  if (!Array.isArray(incoming)) throw new Error('Invalid data format');
  savePosts(incoming);
  return incoming;
}
