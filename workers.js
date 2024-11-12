addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const domain = url.searchParams.get('domain')
  const size = url.searchParams.get('size') || '128'

  if (!domain) {
    return new Response('Domain parameter is required', { status: 400 })
  }

  // 尝试获取 favicon
  const faviconUrl = await getFaviconUrl(domain, size)
  if (faviconUrl) {
    return fetchFavicon(faviconUrl)
  } else {
    return new Response('Favicon not found', { status: 404 })
  }
}

async function getFaviconUrl(domain, size) {
  const defaultPaths = [
    `https://api.faviconkit.com/${domain}/${size}`,
    `https://${domain}/favicon.ico`,
    `https://${domain}/favicon.png`,
    `https://${domain}/favicon.gif`,
    `https://${domain}/favicon.svg`,
    `https://${domain}/favicon.jpg`,
    `https://${domain}/favicon.webp`
  ];

  // 并行请求所有默认路径
  const fetchPromises = defaultPaths.map(async (path) => {
    const response = await fetchWithTimeout(path);
    return response.ok ? path : null;
  });

  const results = await Promise.all(fetchPromises);
  return results.find(url => url !== null) || null;
}

async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const signal = controller.signal;
  const fetchPromise = fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    signal
  });

  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetchPromise;
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    console.error(`Fetch error for ${url}: ${error.message}`);
    return new Response('Error fetching favicon', { status: 500 });
  }
}

function extractFaviconUrls(html, homepageUrl) {
  const faviconUrls = [];
  const faviconRegex = /<link[^>]+rel=["']?([^"'>]+)["']?[^>]+href=["']?([^"'>]+)["']?/gi;
  let match;

  while ((match = faviconRegex.exec(html)) !== null) {
    const rel = match[1].toLowerCase();
    const href = match[2];

    // 只关注相关的 rel 值
    if (rel.includes('icon') || rel.includes('apple-touch-icon')) {
      faviconUrls.push(new URL(href, homepageUrl).href);
    }
  }

  return faviconUrls;
}

async function fetchFavicon(faviconUrl) {
  try {
    const response = await fetchWithTimeout(faviconUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch favicon');
    }
    return new Response(response.body, {
      headers: { 'Content-Type': 'image/x-icon' }
    });
  } catch (error) {
    return new Response('Error fetching favicon: ' + error.message, { status: 500 });
  }
}
