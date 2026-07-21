import { Link } from 'react-router-dom';
import type { Project } from '../data/siteData';
import { Icon } from './Icons';

const nazwyKategorii:Record<Project['category'],string>={video:'Muzyczne',tools:'Techniczne',community:'Klockowe',secret:'Eksperymentalne'};

export function ProjectCard({project}:{project:Project}){
 return <article className={`project-card accent-${project.accent} ${project.locked?'locked':''}`}>
  <div className="project-visual"><div className="visual-grid"/><div className="visual-orb one"/><div className="visual-orb two"/><div className="visual-symbol">{project.locked?<Icon name="lock" size={30}/>:project.title.slice(0,2).toUpperCase()}</div><span className="status-chip">{project.status}</span>{project.locked&&<div className="project-lock-overlay"><Icon name="lock" size={17}/><span>Dostępne po zalogowaniu</span></div>}</div>
  <div className="project-card-body"><div className="project-meta"><span className={`category-badge category-${project.category}`}>{nazwyKategorii[project.category]}</span><span className="eyebrow">{project.eyebrow}</span></div><h3>{project.title}</h3><p>{project.description}</p><div className="project-progress-label"><span>Postęp projektu</span><strong>{project.progress}%</strong></div><div className="progress-track"><span style={{width:`${project.progress}%`}}/></div><div className="project-card-footer"><span className="project-signal">12 aktualizacji</span>{project.locked?<button className="text-link muted" disabled><Icon name="lock" size={15}/> Wymaga konta</button>:<Link className="text-link" to={`/projekty/${project.slug}`}>Otwórz <Icon name="arrow" size={15}/></Link>}</div></div>
 </article>
}
