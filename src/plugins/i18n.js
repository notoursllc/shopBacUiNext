// copied from: https://github.com/antfu/vitesse/blob/main/src/modules/i18n.ts
import { createI18n } from 'vue-i18n';

// Import i18n resources
// https://vitejs.dev/guide/features.html#glob-import
//
const i18n = createI18n({
    legacy: false,
    locale: '',
    messages: {},
});

const localesMap = Object.fromEntries(
    Object
      .entries(import.meta.glob('../locales/*.js'))
      .map(([path, loadLocale]) => [path.match(/([\w-]*)\.js$/)?.[1], loadLocale]),
)

export const availableLocales = Object.keys(localesMap)

const loadedLanguages = [];

function setI18nLanguage(lang) {
    i18n.global.locale.value = lang;

    if (typeof document !== 'undefined') {
        document.querySelector('html')?.setAttribute('lang', lang);
    }

    return lang;
}

export async function loadLanguageAsync(lang) {
  // If the same language
  if (i18n.global.locale.value === lang) {
      return setI18nLanguage(lang);
  }

  // If the language was already loaded
  if (loadedLanguages.includes(lang)) {
      return setI18nLanguage(lang);
  }

  // If the language hasn't been loaded yet
  const messages = await localesMap[lang]();
  i18n.global.setLocaleMessage(lang, messages.default);
  loadedLanguages.push(lang);
  return setI18nLanguage(lang);
}


export default {
    install: (app) => {
        console.log('installing i18n')

        app.use(i18n);
        loadLanguageAsync('en-US')
    }
};