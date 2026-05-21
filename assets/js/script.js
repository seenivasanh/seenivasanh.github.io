// Fetch 3 most recent posts from RSS feed for homepage blog preview
(async () => {
  const list = document.getElementById('blog-preview');
  if (!list) return;
  try {
    const res = await fetch('/feed.xml');
    const txt = await res.text();
    const xml = new DOMParser().parseFromString(txt, 'application/xml');
    const items = [...xml.querySelectorAll('item')].slice(0, 3);
    if (!items.length) {
      list.innerHTML = '<li style="padding:1rem 0;color:var(--muted);font-size:0.9rem;">No posts yet — check back soon.</li>';
      return;
    }
    list.innerHTML = items.map(item => {
      const title = item.querySelector('title')?.textContent || '';
      const link  = item.querySelector('link')?.textContent || '#';
      const pub   = item.querySelector('pubDate')?.textContent || '';
      const desc  = item.querySelector('description')?.textContent || '';
      const date  = pub ? new Date(pub).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
      const plain = desc.replace(/<[^>]+>/g, '').trim().split(/\s+/).slice(0, 25).join(' ') + '…';
      return `<li class="blog-item">
        <span class="blog-date">${date}</span>
        <div>
          <a class="blog-title" href="${link.trim()}">${title}</a>
          <p class="blog-excerpt">${plain}</p>
        </div>
      </li>`;
    }).join('');
  } catch (e) {
    list.innerHTML = '<li style="padding:1rem 0;"><a href="/blog/" style="color:var(--blue);">Visit the blog →</a></li>';
  }
})();
