class TextFill extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isInViewport = false;
    this.observer = null;
  }

  static get observedAttributes() {
    return [
      'text', 'background-color', 'font-color', 'font-family', 'font-size',
      'animation-fill-color', 'animation-direction', 'text-alignment', 'image-url', 'animation-duration'
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
    this.handleResize = () => this.render(); // Re-render on resize for responsiveness
    window.addEventListener('resize', this.handleResize);
    
    // Set up Intersection Observer to detect when element enters viewport
    this.setupIntersectionObserver();
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.handleResize);
    // Clean up the observer when element is removed
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  setupIntersectionObserver() {
    // Create an observer with options
    const options = {
      root: null, // Use the viewport as the root
      rootMargin: '0px', // No margin
      threshold: 0.1 // Trigger when at least 10% of the element is visible
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Element has entered the viewport
          this.isInViewport = true;
          this.startAnimation();
        } else {
          // Element has left the viewport
          this.isInViewport = false;
          this.pauseAnimation();
        }
      });
    }, options);

    // Start observing this element
    this.observer.observe(this);
  }

  startAnimation() {
    const textContainer = this.shadowRoot.querySelector('.text-container');
    if (textContainer) {
      textContainer.classList.add('animate');
    }
  }

  pauseAnimation() {
    const textContainer = this.shadowRoot.querySelector('.text-container');
    if (textContainer) {
      textContainer.classList.remove('animate');
    }
  }

  render() {
    // Get attribute values with fallbacks
    const text = this.getAttribute('text') || 'Animated text fill';
    const backgroundColor = this.getAttribute('background-color') || '#1C2526'; // Deep charcoal
    const fontColor = this.getAttribute('font-color') || '#A9B1B2'; // Muted silver
    const fontFamily = this.getAttribute('font-family') || 'Lora'; // Dark elegant serif
    const fontSize = parseFloat(this.getAttribute('font-size')) || 5; // In vw
    const animationFillColor = this.getAttribute('animation-fill-color') || '#26A69A'; // Rich teal
    const animationDirection = this.getAttribute('animation-direction') || 'left'; // Default left
    const textAlignment = this.getAttribute('text-alignment') || 'center'; // Default center
    const imageUrl = this.getAttribute('image-url') || ''; // Optional image URL
    const animationDuration = this.getAttribute('animation-duration') || '10'; // In seconds

    // Determine animation keyframes based on direction
    let keyframes;
    switch (animationDirection) {
      case 'right':
        keyframes = `
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        `;
        break;
      case 'up':
        keyframes = `
          0% { background-position: 50% 100%; }
          100% { background-position: 50% 0%; }
        `;
        break;
      case 'down':
        keyframes = `
          0% { background-position: 50% 0%; }
          100% { background-position: 50% 100%; }
        `;
        break;
      case 'left':
      default:
        keyframes = `
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        `;
        break;
    }

    // Use image URL if provided, otherwise fallback to gradient
    const backgroundStyle = imageUrl 
      ? `url(${imageUrl}) repeat-y`
      : `linear-gradient(to ${animationDirection === 'up' || animationDirection === 'down' ? 'top' : 'right'}, ${animationFillColor}, ${backgroundColor}, ${animationFillColor})`;

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
          background: ${backgroundColor};
          overflow: hidden;
        }

        .text-wrapper {
          max-width: 80vw; /* Limit width to 80% of viewport for wrapping */
          display: flex;
          justify-content: ${textAlignment === 'left' ? 'flex-start' : textAlignment === 'right' ? 'flex-end' : 'center'};
          align-items: center;
        }

        .text-container {
          text-transform: uppercase;
          letter-spacing: 0;
          padding: 0.25em 0;
          display: inline-block;
          text-align: ${textAlignment};
          font-family: ${fontFamily}, serif;
          font-size: ${fontSize}vw;
          font-weight: 700;
          color: ${fontColor};
          text-shadow: 0 0 80px rgba(255, 255, 255, 0.5);
          background: ${backgroundStyle};
          background-size: ${animationDirection === 'up' || animationDirection === 'down' ? '100% 200%' : '200% 100%'};
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          -webkit-transform: translate3d(0, 0, 0);
          -webkit-backface-visibility: hidden;
          word-wrap: break-word; /* Enable text wrapping */
          overflow-wrap: break-word; /* Modern standard */
          white-space: normal; /* Allow multiple lines */
          line-height: 1.2; /* Consistent line spacing */
          /* Animation is initially paused */
          animation: aitf ${animationDuration}s linear infinite paused;
        }

        /* Class added when element enters viewport */
        .text-container.animate {
          animation-play-state: running;
        }

        @keyframes aitf {
          ${keyframes}
        }
      </style>
      <div class="text-wrapper">
        <span class="text-container">${text}</span>
      </div>
    `;
    
    // If already in viewport when rendered, start animation
    if (this.isInViewport) {
      this.startAnimation();
    }
  }
}

customElements.define('text-fill', TextFill);
