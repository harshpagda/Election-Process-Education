import { useTranslation } from 'react-i18next';
import AppRoutes from './routes';
import './styles/map.css';

function App() {
  const { i18n } = useTranslation();

  return (
    <div dir={i18n.language === 'hi' ? 'rtl' : 'ltr'}>
      <AppRoutes />
    </div>
  );
}

export default App;
