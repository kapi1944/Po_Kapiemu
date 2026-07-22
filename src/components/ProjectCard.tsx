import { useState } from 'react';
import { Link } from 'react-router-dom';
import { nazwyKategorii, type Project } from '../data/siteData';
import { Icon } from './Icons';

export function ProjectCard({ project }: { project: Project }) {
  const [zapisany, ustawZapisany] = useState(Boolean(project.saved));
  const sygnalSpolecznosciowy = project.commentsCount ? `${project.commentsCount} komentarzy` : 'Cisza na razie';

  return <article className={`project-card category-${project.category} ${project.locked ? 'locked' : ''}`}>
    <div className="project-visual">
      {project.image ? <img src={project.image} alt=""/> : <><div className="visual-grid"/><div className="visual-orb one"/><div className="visual-orb two"/><div className="visual-symbol">{project.title.slice(0,2).toUpperCase()}</div></>}
      <div className="project-visual-meta"><span className="category-badge">{nazwyKategorii[project.category]}</span><span className="status-chip">{project.status}</span></div>
      <button type="button" className="bookmark-button" aria-label={zapisany ? `Usuń ${project.title} z zapisanych` : `Zapisz ${project.title}`} aria-pressed={zapisany} onClick={() => ustawZapisany(obecny => !obecny)}><Icon name="bookmark" size={15}/></button>
    </div>
    <div className="project-card-body">
      <h3>{project.locked ? project.title : <Link to={`/projekty/${project.slug}`}>{project.title}</Link>}</h3><p>{project.description}</p>
      <div className="project-progress-label"><span>Postęp</span><strong>{project.progress}%</strong></div>
      <div className="progress-track" aria-label={`Postęp: ${project.progress}%`}><span style={{width:`${project.progress}%`}}/></div>
      <div className="project-card-footer"><span className="project-signal"><Icon name="people" size={13}/>{sygnalSpolecznosciowy}</span></div>
    </div>
  </article>;
}
