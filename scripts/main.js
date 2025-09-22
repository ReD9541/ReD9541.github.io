const userName = 'ReD9541';
const projectContainer = document.getElementById('project-cards');
const filterSelect = document.getElementById('filter-language');
let allProjects = [];

// Map languages to FontAwesome icons
const languageIcons = {
  JavaScript: '<i class="fab fa-js-square" title="JavaScript"></i>',
  Python: '<i class="fab fa-python" title="Python"></i>',
  HTML: '<i class="fab fa-html5" title="HTML"></i>',
  CSS: '<i class="fab fa-css3-alt" title="CSS"></i>',
  TypeScript: '<i class="fab fa-js" title="TypeScript"></i>',
  Java: '<i class="fab fa-java" title="Java"></i>',
  Ruby: '<i class="fas fa-gem" title="Ruby"></i>',
  'C++': '<i class="fas fa-code" title="C++"></i>',
};

// Load external HTML into a container
async function loadHTML(url, containerId) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}`);
    const html = await res.text();
    document.getElementById(containerId).innerHTML = html;
  } catch (error) {
    console.error(error);
  }
}

// Fetch GitHub API without authentication (public)
async function fetchGitHubAPI(url) {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  });
  if (!res.ok) {
    throw new Error(`${res.status} - ${await res.text()}`);
  }
  return res.json();
}

// Fetch README content from GitHub and parse markdown
async function fetchReadme(user, repo) {
  try {
    const data = await fetchGitHubAPI(`https://api.github.com/repos/${user}/${repo}/readme`);
    const decoded = atob(data.content.replace(/\n/g, ''));
    return marked.parse(decoded);
  } catch {
    return `<p><em>No README available.</em></p>`;
  }
}

// Normalize language class for badge styling
function languageClass(lang) {
  if (!lang) return 'language-Other';
  const cleanLang = lang.replace(/\+/g, 'Plus').replace(/\s/g, '');
  return `language-${cleanLang}`;
}

// Create language badge HTML
function createBadge(lang) {
  const className = languageClass(lang);
  const icon = languageIcons[lang] || '<i class="fas fa-code"></i>';
  return `<span class="language-badge ${className}">${icon} ${lang || 'Other'}</span>`;
}

// Create project card with front (info) and back (README)
function createProjectCard(project, readmeHTML) {
  return `
    <div class="col-md-6 col-lg-4 fade-in">
      <div class="project-card" tabindex="0" aria-label="Project ${project.name}">
        <div class="project-card-inner">
          <div class="project-card-front">
            <h5 class="project-title">
              ${createBadge(project.language)} 
              ${project.name}
            </h5>
            <p class="project-desc">${project.description || 'No description available.'}</p>
            <a href="${project.html_url}" target="_blank" rel="noopener noreferrer" class="btn btn-success btn-sm btn-repo mt-3" aria-label="View ${project.name} on GitHub">View Repo</a>
            <div class="project-stats mt-3">
              <span>⭐ ${project.stargazers_count}</span>
              <span>🍴 ${project.forks_count}</span>
            </div>
          </div>
          <div class="project-card-back">
            <h5 class="project-title">${project.name} README</h5>
            <div class="readme-content">${readmeHTML}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Filter projects by language
function filterProjects(projects, lang) {
  if (lang === 'all') return projects;
  return projects.filter((p) => p.language === lang);
}

// Render project cards
async function renderProjects(projects) {
  projectContainer.innerHTML = '';

  for (const project of projects) {
    const readmeHTML = await fetchReadme(userName, project.name);
    projectContainer.insertAdjacentHTML('beforeend', createProjectCard(project, readmeHTML));
  }
}

// Populate language filter dropdown
function updateLanguageFilter(projects) {
  const langSet = new Set(projects.map((p) => p.language).filter(Boolean));
  filterSelect.innerHTML = `<option value="all">Filter by Language</option>`;
  langSet.forEach((lang) => {
    const option = document.createElement('option');
    option.value = lang;
    option.textContent = lang;
    filterSelect.appendChild(option);
  });
}

// Load projects from GitHub
async function loadProjects() {
  try {
    const repos = await fetchGitHubAPI(`https://api.github.com/users/${userName}/repos?per_page=100`);
    allProjects = repos.filter((r) => !r.fork);
    updateLanguageFilter(allProjects);
    await renderProjects(allProjects);
  } catch (e) {
    projectContainer.innerHTML = `<p class="text-danger text-center">Error loading projects: ${e.message}</p>`;
  }
}

// Initialize everything on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  loadHTML('header.html', 'header-placeholder');
  loadHTML('footer.html', 'footer-placeholder');

  loadProjects();

  filterSelect.addEventListener('change', async () => {
    const filtered = filterProjects(allProjects, filterSelect.value);
    await renderProjects(filtered);
  });
});
