const GITHUB_API = 'https://api.github.com';
const IMAGES_DIR = 'uploads';

function getImageConfig() {
  try {
    const data = localStorage.getItem('blog_image_config');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveImageConfig(config) {
  localStorage.setItem('blog_image_config', JSON.stringify(config));
}

export function loadImageConfig() {
  return getImageConfig();
}

export function isImageConfigured() {
  const config = getImageConfig();
  return Boolean(config?.username && config?.repo && config?.token);
}

function generateFileName(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
  return `${id}.${ext}`;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // reader.result is "data:image/png;base64,XXXX"
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Upload an image file to the GitHub repo.
 * Returns the public raw URL of the uploaded image.
 */
export async function uploadImage(file) {
  const config = getImageConfig();
  if (!config) throw new Error('Image hosting not configured. Go to Settings.');

  const fileName = generateFileName(file);
  const path = `${IMAGES_DIR}/${fileName}`;
  const base64Content = await fileToBase64(file);

  const response = await fetch(
    `${GITHUB_API}/repos/${config.username}/${config.repo}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${config.token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Upload image: ${fileName}`,
        content: base64Content,
        branch: config.branch || 'main',
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to upload image');
  }

  const data = await response.json();
  // Return the raw URL for direct image access
  return data.content.download_url;
}

/**
 * Test the GitHub connection for image uploads.
 */
export async function testImageConnection() {
  const config = getImageConfig();
  if (!config) throw new Error('Not configured');

  const response = await fetch(
    `${GITHUB_API}/repos/${config.username}/${config.repo}`,
    {
      headers: {
        Authorization: `token ${config.token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  if (!response.ok) throw new Error('Cannot connect. Check your settings.');
  return true;
}
