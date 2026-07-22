import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AboutPage, CommunityPage, ContactPage, ContentPage, CooperationPage, PollsPage, SupportPage } from './pages/OtherPages';
import { AccountPlaceholderPage, AddIdeaPage, CategoriesPage, EquipmentPage, FaqPage, NotFoundPage } from './pages/MissingPages';
import { ReviewsHubPage } from './pages/ReviewsHubPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { AdapterComparisonPage } from './pages/AdapterComparisonPage';
import { ContentDetailPage } from './pages/ContentDetailPage';
import { ReviewDetailPage } from './pages/ReviewDetailPage';
import './App.css';
import './routes.css';

export default function App() {
  return <BrowserRouter><Routes><Route element={<Layout/>}>
    <Route path="/" element={<HomePage/>}/><Route path="/projekty" element={<ProjectsPage/>}/><Route path="/projekty/:slug" element={<ProjectDetailPage/>}/>
    <Route path="/glosowania" element={<PollsPage/>}/><Route path="/tresci" element={<ContentPage/>}/><Route path="/tresci/:slug" element={<ContentDetailPage/>}/><Route path="/recenzje" element={<ReviewsHubPage/>}/><Route path="/recenzje/:slug" element={<ReviewDetailPage/>}/><Route path="/szukaj" element={<SearchResultsPage/>}/><Route path="/porownania/adaptery-usb-c-jack" element={<AdapterComparisonPage/>}/>
    <Route path="/kategorie" element={<CategoriesPage/>}/><Route path="/faq" element={<FaqPage/>}/><Route path="/sprzet-i-polecane" element={<EquipmentPage/>}/>
    <Route path="/spolecznosc" element={<CommunityPage/>}/><Route path="/wsparcie" element={<SupportPage/>}/><Route path="/wspolpraca" element={<CooperationPage/>}/>
    <Route path="/moje-projekty" element={<AccountPlaceholderPage rodzaj="projekty"/>}/><Route path="/obserwowane" element={<AccountPlaceholderPage rodzaj="obserwowane"/>}/><Route path="/zapisane" element={<AccountPlaceholderPage rodzaj="zapisane"/>}/><Route path="/moja-aktywnosc" element={<AccountPlaceholderPage rodzaj="aktywnosc"/>}/>
    <Route path="/dodaj-pomysl" element={<AddIdeaPage/>}/><Route path="/o-kapim" element={<AboutPage/>}/><Route path="/kontakt" element={<ContactPage/>}/><Route path="*" element={<NotFoundPage/>}/>
  </Route></Routes></BrowserRouter>;
}
