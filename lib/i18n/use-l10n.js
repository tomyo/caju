/**
 *
 * @param {Config} config
 *
 * @typedef {Object} Config
 * @param {String} filesPath = './l10n/', // => fetch('./l10n/{language}.json')
 * @param {String} dataAttrName = 'data-l10n-key', // i.e. <p data-l10n-key="...">
 * @param {String} localStorageKeyName = 'language', // i.e. {language: 'xx'}
 * @param {String} sessionCacheKeyPrefix = 'l10n', // i.e. {l10n-es: JSON.encode(dictionary)}
 * @param {String} rootElement = document.documentElement, // <html>
 * @param {String} missingTranslationText = 'MISSING_TRANSLATION',
 * @param {String} defaultLanguage = navigator.language?.split('-')[0],
 * @returns [getUILanguage(), getPreferredLanguage(), translateInto()]
 */
export function useL10n({ fallbackLanguage = navigator.language?.split("-")[0], ...config }) {
  const { getPreferredLanguage, setPrefferedLanguage, cacheUITranslations, getUILanguage, translateInto } = setupWith({
    fallbackLanguage,
    ...config,
  });

  cacheUITranslations(); // Prevents fetching initial UI language later on

  if (!getPreferredLanguage()) setPrefferedLanguage(fallbackLanguage);

  return [getUILanguage, getPreferredLanguage, translateInto];
}

function setupWith({
  filesPath = "./l10n/", // Lookup => ./l10n/{language}.json (relative)
  dataAttrName = "data-l10n-key",
  localStorageKeyName = "language", // i.e. 'es', 'en'
  sessionCacheKeyPrefix = "l10n", // l10n-{language}
  rootElement = document.documentElement,
  missingTranslationText = "MISSING_TRANSLATION",
  fallbackLanguage = navigator.language?.split("-")[0],
} = {}) {
  validateConfig();
  const hasFetched = {
    /*lang: bool*/
  };

  const getUILanguage = () => rootElement.getAttribute("lang")?.split("-")[0];
  const setUILanguage = (language) => rootElement.setAttribute("lang", language);
  const getPreferredLanguage = () => localStorage.getItem(localStorageKeyName);
  const setPrefferedLanguage = (lang) => localStorage.setItem(localStorageKeyName, lang);

  function getSessionCache(language) {
    return JSON.parse(sessionStorage.getItem(`${sessionCacheKeyPrefix}-${language}`));
  }

  function setSessionCache(language, data) {
    sessionStorage.setItem(`${sessionCacheKeyPrefix}-${language}`, JSON.stringify(data));
  }

  function cacheUITranslations() {
    const dictionary = {};
    for (const element of rootElement.querySelectorAll(`[${dataAttrName}]`)) {
      dictionary[element.getAttribute(dataAttrName)] = (element.innerText || element.innerHTML).trim();
    }
    setSessionCache(getUILanguage(), dictionary);
  }

  async function fetchTranslationFor(language) {
    const baseUrl = new URL(filesPath, document.location);
    const url = new URL(`${language}.json`, baseUrl);
    const response = await fetch(url);
    if (response.ok) return response.json();

    if (response.status != 404) {
      throw new Error(`HTTP error, ${response.status}: ${response.statusText}`);
    }
    return null;
  }

  async function getTranslations(language) {
    let result = getSessionCache(language);

    if (!result || !hasFetched[language]) {
      try {
        const freshContent = await fetchTranslationFor(language);
        if (freshContent) {
          setSessionCache(language, freshContent);
          result = freshContent;
        }
      } catch (error) {
        console.warn(error);
      } finally {
        hasFetched[language] = true;
      }
    }

    return result;
  }

  async function getTranslation(language, key) {
    let translation = (await getTranslations(language))[key];
    if (translation) return translation;
    translation = (await getTranslations(fallbackLanguage))[key];
    if (translation) return translation;

    return missingTranslationText;
  }

  async function translateInto(language) {
    if ((language === getPreferredLanguage()) == getUILanguage()) {
      console.info(`Omitting translating into current langauge "${language}".`);
      return;
    }

    // Find and translate all DOM elements below rootElement
    for (const element of rootElement.querySelectorAll(`[${dataAttrName}]`)) {
      const key = element.getAttribute(dataAttrName);
      const newText = await getTranslation(language, key);
      element.innerText = await getTranslation(language, key);
    }

    // Keep UI and LocalStorage in sync
    setUILanguage(language);
    setPrefferedLanguage(language);
  }

  // CHECKS
  function validateConfig() {
    if (!filesPath.endsWith("/")) {
      throw new Error("`filesPath` option must end with a forward slash /");
    }
  }

  return {
    getUILanguage,
    setUILanguage,
    getPreferredLanguage,
    setPrefferedLanguage,
    translateInto,
    cacheUITranslations,
  };
}
