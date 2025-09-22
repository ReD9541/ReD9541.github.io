const githubUser = 'ReD9541';
const projectsSection = document.getElementById('project-cards');
let githubUserData = null;

async function getReadmeSnippet(user, repo) {
  const endpoint = `https://api.github.com/repos/${user}/${repo}/readme`;

  try {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(`README not found for ${repo}`);

    const data = await res.json();
    const decoded = atob(data.content.replace(/-/g, '+').replace(/_/g, '/'));

    return decoded.slice(0, 200) + '...';
  } catch {
    return 'No description available.';
  }
}

async function renderRepositories(user) {
  try {
    const res = await fetch(`https://api.github.com/users/${user}/repos`);
    if (!res.ok) throw new Error('Could not fetch repositories');

    const repos = await res.json();
    if (!projectsSection) return;

    for (const repo of repos) {
      const description = await getReadmeSnippet(user, repo.name);

      const col = document.createElement('div');
      col.classList.add('col-md-6');

      col.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">${repo.name}</h5>
            <p class="card-text">${description}</p>
            <a href="${repo.html_url}" class="btn btn-primary" target="_blank">View Repository</a>
          </div>
        </div>
      `;

      projectsSection.appendChild(col);
    }
  } catch {
    if (projectsSection) {
      projectsSection.innerHTML = `<p class="text-danger text-center">Unable to load repositories.</p>`;
    }
  }
}

async function loadFragment(path, targetId) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);

    const html = await res.text();
    document.getElementById(targetId).innerHTML = html;

    if (targetId === 'header-placeholder') {
      if (!githubUserData) {
        const userRes = await fetch(`https://api.github.com/users/${githubUser}`);
        githubUserData = await userRes.json();
      }

      const avatar = document.getElementById('github-avatar');
      if (avatar) {
        avatar.src = githubUserData.avatar_url;
        avatar.alt = `${githubUserData.login}'s avatar`;
      }
    }
  } catch (err) {
    console.error(`Fragment load failed for ${targetId}`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadFragment('header.html', 'header-placeholder');
  loadFragment('footer.html', 'footer-placeholder');
  renderRepositories(githubUser);
});
