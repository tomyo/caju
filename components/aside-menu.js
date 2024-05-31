import "./nav-button.js";

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
          <a href="/#" >
            <picture>
              <source srcset="/assets/images/initials-300w.avif 1x, /assets/images/initials-600w.avif 2x" type="image/avif">
              <img srcset="/assets/images/initials-300w.png 1x, /assets/images/initials-600w.png 2x" height="25" alt="Go to home">
            </picture>
          </a>
          <nav-button data-state=${this.dataset.state}></nav-button>
        </aside>

        <main>
          <nav>
            <a data-l10n-key="comissioned" href="/comissioned/" style="color: #50ab95">COMISSIONED</a>
            <a data-l10n-key="services" href="/#services">SERVICES</a>
            <a data-l10n-key="about" href="/#about">ABOUT</a>
            <a data-l10n-key="contact" href="/#contact">CONTACT</a>
            <span class="lang-switch">
              <label>
              EN
              <input name="language" data-l10n-lang="en" type="radio" checked>
              </label>
              <label>
                ES
                <input name="language" data-l10n-lang="es" type="radio" >
              </label>
            </span>
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
                --gap: 4rem;

                position: relative;
                display: grid;
                gap: var(--gap);
                margin-top: calc(var(--gap) * 2);
                text-align: center;
                color: inherit;
                width: 18ch; /* Avoid background moving on lang-switch, this must be enought to fit longest menu entry */

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
      if (name === "data-state" && oldValue !== newValue) this.navButton.dataset.state = newValue;
    }

    addEventsListeners() {
      this.navButton.addEventListener("click", this);

      // document.documentElement.addEventListener("click", this);

      window.addEventListener("hashchange", this.handleHashChange);
    }

    handleEvent(event) {
      this[`on${event.type}`](event);
    }

    onclick(event) {
      if (event.target == this.navButton) return this.toggleMenu();
    }

    handleMenuClose = (event) => {
      if (this.dataset.state === "collapsed") return;

      if (!event.composedPath().includes(this)) {
        // click outside the menu, close it
        return this.toggleMenu();
      }
    };

    handleHashChange = (event) => {
      if (this.dataset.state === "collapsed") return;

      const newUrl = new URL(event.newURL);
      const selector = `a[href="${newUrl.hash}"], a[href="/${newUrl.hash}"]`;
      if (this.querySelector(selector)) {
        // When scrolling to a same-page hash link, close the menu.
        this.toggleMenu();
        return;
      }
    };

    toggleMenu() {
      this.dataset.state = "expanded" == this.dataset.state ? "collapsed" : "expanded";
    }
  }
);
