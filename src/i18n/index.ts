import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        dashboard: "Dashboard",
        profile: "Profile",
        mapView: "Map View",
        login: "Login",
        logout: "Logout",
        municipalLogin: "Municipal Login"
      },
      common: {
        loading: "Loading...",
        back: "Back"
      }
    }
  },
  hi: {
    translation: {
      nav: {
        home: "होम",
        dashboard: "डैशबोर्ड",
        profile: "प्रोफाइल",
        mapView: "मैप व्यू",
        login: "लॉगिन",
        logout: "लॉगआउट",
        municipalLogin: "नगरपालिका लॉगिन"
      },
      common: {
        loading: "लोड हो रहा है...",
        back: "वापस"
      }
    }
  },
  te: {
    translation: {
      nav: {
        home: "హోమ్",
        dashboard: "డాష్‌బోర్డ్",
        profile: "ప్రొఫైల్",
        mapView: "మ్యాప్ వ్యూ",
        login: "లాగిన్",
        logout: "లాగ్అవుట్",
        municipalLogin: "మునిసిపల్ లాగిన్"
      },
      common: {
        loading: "లోడింగ్...",
        back: "వెనుకకు"
      }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;