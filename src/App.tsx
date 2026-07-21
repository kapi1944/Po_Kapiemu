import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AboutPage, CommunityPage, ContactPage, ContentPage, CooperationPage, PollsPage, ReviewsPage, SupportPage } from './pages/OtherPages';
import './App.css';

export default function App(){
 return <BrowserRouter><Routes><Route element={<Layout/>}><Route path="/" element={<HomePage/>}/><Route path="/projekty" element={<ProjectsPage/>}/><Route path="/projekty/:slug" element={<ProjectDetailPage/>}/><Route path="/glosowania" element={<PollsPage/>}/><Route path="/tresci" element={<ContentPage/>}/><Route path="/recenzje" element={<ReviewsPage/>}/><Route path="/spolecznosc" element={<CommunityPage/>}/><Route path="/wsparcie" element={<SupportPage/>}/><Route path="/wspolpraca" element={<CooperationPage/>}/><Route path="/o-kapim" element={<AboutPage/>}/><Route path="/kontakt" element={<ContactPage/>}/></Route></Routes></BrowserRouter>;
}
