customElements.define(
  "nav-button",
  class extends HTMLElement {
    constructor() {
      super().attachShadow({ mode: "open" }).innerHTML = /*html*/ `
        <div></div>

        <style>
          :host {
            display: block;
            width: 40px;
          }


          :host:after, 
          :host:before, 
          :host div {
            background-color: var(--color);
            border-radius: 1px;
            content: '';
            display: block;
            height: 3px;
            margin: 5px 0;
            transition: all .2s ease-in-out;
          }

          :host([data-state="expanded"])::before {
            transform: translateY(250%) rotate(135deg);
          }

          :host([data-state="expanded"])::after {
            transform: translateY(-275%) rotate(-135deg);
          }

          :host([data-state="expanded"]) div {
            transform: scale(0);
          }
        </style>
      `;
    }

    static get observedAttributes() {
      return ["data-state"];
    }

    attributeChangedCallback = (name, oldValue, newValue) => {
      console.log("manu-aside", value, oldValue, newValue);
    };
  }
);
