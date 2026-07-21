import { useState } from 'react';
import { Link } from 'react-router-dom';
import { nazwyKategorii, type Project } from '../data/siteData';
import { Icon } from './Icons';

export function ProjectCard({ project }: { project: Project }) {
  const [zapisany, ustawZapisany] = useState(Boolean(project.saved));
  const sygnal = project.commentsCount ? `${project.commentsCount} komentarzy` : `${project.updatesCount ?? 0} aktualizacji`;

  return <article className={`project-card category-${project.category} ${project.locked ? 'locked' : ''}`}>
    <div className="project-visual">
      {project.image ? <img src={project.image} alt=""/> : <><div className="visual-grid"/><div className="visual-orb one"/><div className="visual-orb two"/><div className="visual-symbol">{project.title.slice(0,2).toUpperCase()}</div></>}
      <span className="status-chip">{project.status}</span>
      <button type="button" className="bookmark-button" aria-label={zapisany ? `Usuń ${project.title} z zapisanych` : `Zapisz ${project.title}`} aria-pressed={zapisany} onClick={() => ustawZapisany(obecny => !obecny)}><Icon name="bookmark" size={15}/></button>
      {project.locked && <div className="project-lock-overlay"><Icon name="lock" size={16}/><span>Dostępne po zalogowaniu</span></div>}
    </div>
    <div className="project-card-body">
      <div className="project-meta"><span className="category-badge">{nazwyKategorii[project.category]}</span><span className="eyebrow">{project.eyebrow}</span></div>
      <h3>{project.title}</h3><p>{project.description}</p>
      <div className="project-progress-label"><span>Postęp projektu</span><strong>{project.progress}%</strong></div>
      <div className="progress-track" aria-label={`Postęp: ${project.progress}%`}><span style={{width:`${project.progress}%`}}/></div>
      <div className="project-card-footer"><span className="project-signal">{sygnal} · {project.lastUpdated}</span>{project.locked ? <button className="text-link muted" disabled><Icon name="lock" size={15}/> Wymaga konta</button> : <Link className="text-link" to={`/projekty/${project.slug}`}>Otwórz <Icon name="arrow" size={15}/></Link>}</div>
    </div>
  </article>;
}
