import './style.css';

const toggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', '메뉴 열기');
  mobileNav.hidden = true;
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  mobileNav.hidden = !open;
});
mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !mobileNav.hidden) {
    closeMenu();
    toggle.focus();
  }
});
window.matchMedia('(min-width: 801px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu();
});
document.querySelector('#year').textContent = String(new Date().getFullYear());

// Public data only. No tokens, personal data, or private repositories.
async function loadRepositories() {
  try {
    const response = await fetch('https://api.github.com/orgs/snclabs/repos?type=public&sort=updated&per_page=6', {
      headers: { Accept: 'application/vnd.github+json' },
      signal: AbortSignal.timeout(7000),
    });
    if (!response.ok) return;
    const repositories = await response.json();
    if (!Array.isArray(repositories)) return;
    const projects = repositories.filter((repo) => !repo.fork && !repo.archived && repo.name !== '.github' && repo.name !== 'snclabs.github.io').slice(0, 3);
    if (!projects.length) return;
    const list = document.createElement('div');
    list.className = 'repo-list';
    projects.forEach((repo) => {
      const link = document.createElement('a');
      link.className = 'repo-item';
      link.href = `https://github.com/snclabs/${encodeURIComponent(repo.name)}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      const title = document.createElement('h3');
      title.textContent = repo.name;
      const description = document.createElement('p');
      description.textContent = repo.description || 'SNC Labs의 공개 프로젝트를 GitHub에서 만나보세요.';
      const meta = document.createElement('span');
      meta.className = 'repo-meta';
      meta.textContent = `${repo.language || 'Project'} · ☆ ${Number(repo.stargazers_count) || 0} ↗`;
      link.append(title, description, meta);
      list.append(link);
    });
    document.querySelector('#repo-content').replaceChildren(list);
    document.querySelector('#github-status').textContent = 'From SNC Labs, out in the open.';
  } catch {
    // The curated first-commit state remains useful offline or when rate limited.
  }
}
loadRepositories();
