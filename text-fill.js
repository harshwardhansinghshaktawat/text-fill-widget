class TextFill extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['font-color', 'font-family', 'font-size', 'animation-fill-color'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    // Get attribute values with fallbacks
    const fontColor = this.getAttribute('font-color') || '#A9B1B2'; // Muted silver
    const fontFamily = this.getAttribute('font-family') || 'Lora'; // Dark elegant serif
    const fontSize = this.getAttribute('font-size') || '5'; // In vw
    const animationFillColor = this.getAttribute('animation-fill-color') || '#26A69A'; // Rich teal

    // Inject HTML and CSS into shadow DOM
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          width: 100vw;
          height: 100vh;
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #1C2526; /* Deep charcoal */
          overflow: hidden;
        }

        .text-container {
          text-transform: uppercase;
          letter-spacing: 0;
          padding: 0.25em 0;
          display: block;
          text-align: center;
          font-family: ${fontFamily}, serif;
          font-size: ${fontSize}vw;
          font-weight: 700;
          color: ${fontColor};
          text-shadow: 0 0 80px rgba(255, 255, 255, 0.5);
          background: linear-gradient(to right, ${animationFillColor}, #1C2526, ${animationFillColor});
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: aitf 10s linear infinite; /* Faster than 80s for better effect */
          -webkit-transform: translate3d(0, 0, 0);
          -webkit-backface-visibility: hidden;
        }

        @keyframes aitf {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      </style>
      <span class="text-container">Animated text fill</span>
    `;
  }
}

customElements.define('text-fill', TextFill);
