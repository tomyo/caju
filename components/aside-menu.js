import "./nav-button.js";

customElements.define(
  "aside-menu",
  class extends HTMLElement {
    constructor() {
      super(); //.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      this.renderShadow();
      this.navButton = this.querySelector("nav-button");

      this.addEventsListeners();

      // Set initial state
      this.dataset.state = this.dataset.state ?? "collapsed";
    }

    renderShadow() {
      this.innerHTML = /*html*/ `
        <nav-button data-state=${this.dataset.state}></nav-button>
        
        <main>
          <nav>
            <a href="/commissioned" style="color: #50ab95">COMMISSIONED</a>
            <a href="/#services">SERVICES</a>
            <a href="/#about">ABOUT</a>
            <a href="/#contact">CONTACT</a>
            <a href="/#">ES EN</a>
            <picture>
              <!-- bg image -->
              <source srcset="/assets/images/caju-menu-600w.avif" type="image/avif"/>
              <img srcset="/assets/images/caju-menu-600w.png" height="700px"/>
            </picture>
          </nav>
        
        </main>

        <style>

          aside-menu[data-state="expanded"] main{
            --display: grid;
            z-index: 2;
          }

          aside-menu {
            --button-size: 40px;
            --button-right: 3rem;

            
            main {
              display: var(--display, none);
              place-content: center;
              position: fixed;
              inset: 0;
              height: 100%;
              width: 100%;

              background-color: var(--bg-color);
              background-image: image-set( url("/assets/images/bg-texture.avif") type("image/avif"), url("/assets/images/bg-texture.png") type("image/png") );

              nav {
                --gap: 4rem;

                position: relative;
                display: grid;
                gap: var(--gap);
                margin-top: calc(var(--gap) * 2);
                text-align: center;
                color: inherit;
                
                a {
                  font-weight: 600;
                  text-decoration: none;
                }

                img {
                  position: absolute;
                  inset: 0;
                  height: 140%;
                  translate: -34% -28%;
                  opacity: .5;
                  z-index: -1;
                }
              }
            }

            nav-button {
              position: fixed;
              cursor: pointer;
              top: 1.5rem;
              width: var(--button-size);
              right: var(--button-size);
              z-index: 3;
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
