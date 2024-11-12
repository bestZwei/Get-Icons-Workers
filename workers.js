addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const domain = url.searchParams.get('domain')

  if (!domain) {
    return new Response('Domain parameter is required', { status: 400 })
  }

  // 尝试获取 favicon
  const faviconUrl = await getFaviconUrl(domain)
  if (faviconUrl) {
    return fetchFavicon(faviconUrl)
  } else {
    return new Response('Favicon not found', { status: 404 })
  }
}

async function getFaviconUrl(domain) {
  const defaultPaths = [
    `https://${domain}/favicon.ico`,
    `https://${domain}/favicon.png`,
    `https://${domain}/favicon.gif`,
    `https://${domain}/favicon.svg`,
    `https://${domain}/favicon.jpg`,
    `https://${domain}/favicon.webp`
  ];

  // 尝试访问默认的 favicon 路径
  for (const path of defaultPaths) {
    const response = await fetch(path, { method: 'GET' });
    if (response.ok) {
      return path;
    }
  }

  // 抓取首页 HTML
  const homepageUrl = `https://${domain}`;
  const homepageResponse = await fetch(homepageUrl);
  if (!homepageResponse.ok) {
    return null;
  }

  const html = await homepageResponse.text();
  const faviconUrls = extractFaviconUrls(html, homepageUrl);

  // 返回第一个有效的 favicon URL
  for (const faviconUrl of faviconUrls) {
    const response = await fetch(faviconUrl, { method: 'GET' });
    if (response.ok) {
      return faviconUrl;
    }
  }

  return null;
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
    const response = await fetch(faviconUrl, { method: 'GET' });
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
