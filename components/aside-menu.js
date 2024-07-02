import "./nav-button.js";
import "./l10n-switch.js";

customElements.define(
  "aside-menu",
  class extends HTMLElement {
    constructor() {
      super(); //.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      this.renderContent();
      this.navButton = this.querySelector("nav-button");

      this.addEventsListeners();

      // Set initial state
      this.dataset.state = this.dataset.state ?? "collapsed";
    }

    renderContent() {
      this.innerHTML = /*html*/ `
        <aside>
          <a href="/#">
            <picture>
              <source srcset="/assets/images/initials-300w.avif 1x, /assets/images/initials-600w.avif 2x" type="image/avif">
              <img srcset="/assets/images/initials-300w.png 1x, /assets/images/initials-600w.png 2x" height="25" alt="Go to home">
            </picture>
          </a>
          <nav-button data-state=${this.dataset.state}></nav-button>
        </aside>

        <main>
          <nav>
          <l10n-switch style="color: #50ab95">
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
            </l10n-switch>
            <a data-l10n-key="services" href="/#services" >SERVICES</a>
            <a data-l10n-key="comissioned" href="/#comissioned" >COMISSIONED</a>
            <a data-l10n-key="about" href="/#about">ABOUT</a>
            <a data-l10n-key="contact" href="/#contact">CONTACT</a>
            
            <picture>
              <!-- bg image -->
              <source srcset="/assets/images/caju-menu-600w.avif" type="image/avif"/>
              <img srcset="/assets/images/caju-menu-600w.png" height="700"/>
            </picture>
          </nav>
        
        </main>

        <style>
          body:has(aside-menu[data-state="expanded"]) {
            overflow: hidden;  /* Avoid scrolling page when menu is open */
          }

          aside-menu[data-state="expanded"] main {
            visibility: visible;
            opacity: 1;
          }

          aside-menu {
            position: fixed;
            inset: 0 0 auto;
            z-index: 10;


            aside {
              display: flex;
              position: relative;
              margin: 1.5rem 2.5rem;
              justify-content: space-between;
              align-items: center;
              z-index: 1;

              /* Got to top and menu buttons */
              > * {
                cursor: pointer;
                opacity: .9;

                img {
                  display: block;
                }
              }
            }


            main {
              display: grid;
              place-content: center;
              position: fixed;
              inset: 0;
              height: 100%;
              width: 100%;

              background-color: var(--bg-color);
              background-image: image-set( url("/assets/images/bg-texture.avif") type("image/avif"), url("/assets/images/bg-texture.png") type("image/png") );
              background-size: 150px;

              /* hidden default state */
              visibility: hidden;
              opacity: 0;
              transition: opacity .25s ease-in-out, visibility .25s ease-out;

              nav {
                --gap: 3.5rem;

                position: relative;
                display: grid;
                gap: var(--gap);
                margin-top: calc(var(--gap) * 2);
                text-align: center;
                color: inherit;
                width: 18ch; /* Avoid background moving on lang-switch, this must be enought to fit longest menu entry */

                & :first-child {
                  margin-bottom: 1.3rem;
                }

                a {
                  font-weight: 600;
                  text-decoration: none;
                  background: none;
                  border: none;
                  color: var(--color);
                }

                .lang-switch {
                  display: flex;
                  gap: .5rem;
                  justify-content: center;

                  label {
                    cursor: pointer;
                    font-weight: 300;

                    &:has(input:checked) {
                      font-weight: 700;
                    }
                  }

                  input {
                    display: none;
                  }
                }

                img {
                  position: absolute;
                  inset: 0;
                  height: 140%;
                  translate: -28% -28%;
                  opacity: .5;
                  z-index: -1;
                }
              }
            }
          }

        </style>
      `;
    }

    static get observedAttributes() {
      return ["data-state"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "data-state" && oldValue !== newValue) {
        // Reflect `state` to inner `<nav-button>`
        this.navButton.dataset.state = newValue;
      }
    }

    addEventsListeners() {
      this.querySelectorAll("a, nav-button").forEach((element) => {
        element.addEventListener("click", this);
      });
    }

    handleEvent(event) {
      // click -> Click
      this[`on${event.type[0].toUpperCase() + event.type.slice(1)}`](event);
    }

    onClick(event) {
      if (event.target == this.navButton || this.dataset.state === "expanded") return this.toggleMenu();
    }

    toggleMenu() {
      this.dataset.state = this.dataset.state == "collapsed" ? "expanded" : "collapsed";
    }
  }
);
