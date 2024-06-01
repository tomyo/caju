import { useL10n } from "/lib/i18n/use-l10n.js";

customElements.define(
  "l10n-switch",
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      if (document.readyState === "complete") return this.setUp();
      window.addEventListener("load", () => this.setUp());
    }

    setUp() {
      const [getUILanguage, getPreferredLanguage, setLanguage] = useL10n({
        filesPath: "/l10n/", // => fetch('./l10n/{language}.json')
        dataAttrName: "data-l10n-key", // i.e. <p data-l10n-key="...">
      });

      for (const switcher of this.querySelectorAll("[data-l10n]")) {
        switcher.addEventListener("click", () => {
          setLanguage(switcher.dataset.l10n);
          switcher.classList.add("active");
        });
      }
    }
  }
);
