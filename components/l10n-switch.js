import { useL10n } from "/lib/i18n/use-l10n.js";

customElements.define(
  "l10n-switch",
  class extends HTMLElement {
    constructor() {
      super(); //.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      this.renderContent();
      this.setUp();
    }

    renderContent() {
      this.innerHTML = /*html*/ `
        <label>
          EN
          <input name="localization" data-l10n="en" type="radio" checked>
        </label>
        <label>
          ES
          <input name="localization" data-l10n="es" type="radio" >
        </label>
        <style>
          l10n-switch {
            display: flex;
            gap: .5rem;
            justify-content: center;

            label {
              cursor: pointer;
              font-weight: 300;

              &:has(input:checked) {
                font-weight: 700;
              }

              input {
                display: none;
              }
            }
          }
        </style>
      `;
    }

    setUp() {
      window.addEventListener("load", () => {
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
      });
    }
  }
);
