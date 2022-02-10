import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import en from './en.json'
import ru from './ru.json'
import uz from "./uz.json"

const resources = {
    en: {
        translation: en
    },
    ru: {
        translation: ru
    },
    uz: {
        translation: uz
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "ru",

        keySeparator: false,

        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
