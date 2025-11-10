
async function loadProjects(){
  const el = document.getElementById('projects');
  try {
    const resp = await fetch('./data/projects.json');
    const data = await resp.json();
    el.innerHTML = data.map(p => `
      <article class="card">
        <header style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
          <div>
            <h3 style="margin:0 0 6px 0;">${p.title}</h3>
            <small class="muted">${p.tagline} • ${p.year} • ${p.status}</small>
          </div>
          <a class="button" href="${p.repo}" target="_blank" rel="noopener">View Repo</a>
        </header>
        <p style="margin:10px 0 8px;">${p.description}</p>
        <div>${p.tech.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      </article>
    `).join('');
  } catch(e){
    el.innerHTML = `<p>Could not load projects.json. Please ensure the file path is correct.</p>`;
  }
}

document.addEventListener('DOMContentLoaded', loadProjects);
