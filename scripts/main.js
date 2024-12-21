
const username = 'ReD9541'; 
const projectContainer = document.getElementById('project-cards');

// Function to fetch and decode README.md content
async function fetchReadme(username, repoName) {
  const url = `https://api.github.com/repos/${username}/${repoName}/readme`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`README not found for ${repoName}`);
    const data = await response.json();
    const decodedContent = atob(data.content);
    return decodedContent.substring(0, 200) + '...'; 
  } catch (error) {
    console.error(error);
    return 'No description available.';
  }
}


fetch(`https://api.github.com/users/${username}/repos`)
  .then(response => response.json())
  .then(async repos => {
    for (const repo of repos) {
      const readmeContent = await fetchReadme(username, repo.name); 

      const card = document.createElement('div');
      card.classList.add('col-md-6');
      card.innerHTML = `
        <div class="card h-100">
          <img src="${repo.owner.avatar_url}" class="card-img-top" alt="${repo.name}">
          <div class="card-body">
            <h5 class="card-title">${repo.name}</h5>
            <p class="card-text">${readmeContent}</p>
            <a href="${repo.html_url}" class="btn btn-primary" target="_blank">View Repository</a>
          </div>
        </div>
      `;
      projectContainer.appendChild(card);
    }
  })
  .catch(error => {
    console.error('Error fetching GitHub repositories:', error);
    projectContainer.innerHTML = `<p class="text-danger text-center">Failed to load projects.</p>`;
  });



fetch('header.html')
  .then(res => res.text())
  .then(content => {
    document.getElementById('header-placeholder').innerHTML = content;
  });

fetch('footer.html')
  .then(res => res.text())
  .then(content => {
    document.getElementById('footer-placeholder').innerHTML = content;
  });
