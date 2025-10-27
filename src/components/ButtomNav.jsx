import React,{ useState, useEffect}  from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import buttomLanguage from '../language/buttonNav.json'
function ButtomNav() {
  const navigate = useNavigate();
  const location=useLocation();
  const isActive = (path) => location.pathname === path;
  // Language
 const defaultLang = localStorage.getItem('lang') || 'en';
const [lang, setLang] = useState(defaultLang);
const trans = buttomLanguage[lang] || buttomLanguage['en'];
  return (
    <>
        <nav className="bottom-nav">
        <Link to="/" className={isActive('/')? "buttom-active":""}><i className="fas fa-home"></i><span>{trans.home}</span></Link>
        {/* <Link to="/subjects" className={isActive('/subjects')? "buttom-active":""}><i className="fas fa-book-open"></i><span>{trans.subjects}</span></Link> */}
        <Link to="/quiz" className={isActive('/quiz')? "buttom-active":""}><i className="fas fa-question-circle"></i><span>{trans.quiz}</span></Link>
        {/* <Link to="/wallet" className={isActive('/wallet')? "buttom-active":""}><i className="fas fa-wallet"></i><span>{trans.wallet}</span></Link> */}
        <Link to="/contest" className={isActive('/contest')? "buttom-active": ""}><i className="fas fa-trophy"></i><span>{trans.contest}</span></Link>
        <Link to="/books" className={isActive('/books')? "buttom-active":""}><i className="fas fa-book"></i><span>{trans.books}</span></Link>
        <Link to="/mock-test" className={isActive('/mock-test')? "buttom-active":""}><i class="fas fa-clipboard-list"></i><span>Mock</span></Link>
    </nav>
    </>
  )
}

export default ButtomNav