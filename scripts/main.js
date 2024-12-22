const userName = 'ReD9541';
const projectContainer = document.getElementById('project-cards');
let cachedUserData = null;

// Function to fetch and decode README.md content
async function fetchReadme(userName, repoName) {
  const url = `https://api.github.com/repos/${userName}/${repoName}/readme`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`README not found for ${repoName}`);
    const data = await response.json();
    const decodedContent = atob(data.content.replace(/-/g, '+').replace(/_/g, '/'));
    return decodedContent.substring(0, 200) + '...'; // Limit to 200 characters
  } catch (error) {
    console.error(`Error fetching README for ${repoName}: ${error.message}`);
    return 'No description available.';
  }
}

// Function to load repositories and display them dynamically
async function loadRepositories(userName) {
  try {
    const response = await fetch(`https://api.github.com/users/${userName}/repos`);
    if (!response.ok) throw new Error('Failed to fetch repositories');
    const repos = await response.json();

    if (!projectContainer) {
      console.error('Project container not found');
      return;
    }

    for (const repo of repos) {
      const readmeContent = await fetchReadme(userName, repo.name); // Fetch README content
      const card = document.createElement('div');
      card.classList.add('col-md-6');
      card.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">${repo.name}</h5>
            <p class="card-text">${readmeContent}</p>
            <a href="${repo.html_url}" class="btn btn-primary" target="_blank">View Repository</a>
          </div>
        </div>
      `;
      projectContainer.appendChild(card);
    }
  } catch (error) {
    console.error(`Error loading repositories: ${error.message}`);
    if (projectContainer) {
      projectContainer.innerHTML = `<p class="text-danger text-center">Failed to load projects.</p>`;
    }
  }
}

// Function to load HTML fragments (header/footer)
async function loadHtmlFragment(url, placeholderId) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    const content = await response.text();
    document.getElementById(placeholderId).innerHTML = content;

    if (placeholderId === 'header-placeholder') {
      if (!cachedUserData) {
        const userData = await fetch(`https://api.github.com/users/${userName}`).then((res) => res.json());
        cachedUserData = userData;
      }
      const avatarImg = document.getElementById('github-avatar');
      if (avatarImg) {
        avatarImg.src = cachedUserData.avatar_url;
        avatarImg.alt = `${cachedUserData.login}'s avatar`;
      }
    }
  } catch (error) {
    console.error(`Error loading ${placeholderId}: ${error.message}`);
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  loadHtmlFragment('header.html', 'header-placeholder');
  loadHtmlFragment('footer.html', 'footer-placeholder');
  loadRepositories(userName);
});
