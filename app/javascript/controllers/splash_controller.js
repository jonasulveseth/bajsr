import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["splash"]
  
  connect() {
    // Check if this is a PWA launch
    if (this.isPWA()) {
      this.showSplashScreen()
    }
  }
  
  isPWA() {
    // Check if running as PWA
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true ||
           document.referrer.includes('android-app://')
  }
  
  showSplashScreen() {
    // Create splash screen overlay
    const splash = document.createElement('div')
    splash.id = 'splash-screen'
    splash.innerHTML = `
      <div class="splash-content">
        <div class="logo-container">
          <div class="app-icon">
            <svg class="map-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <h1 class="app-name">Bajsr</h1>
          <p class="app-subtitle">Track Nature's Call</p>
        </div>
        <div class="loading-dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
    `
    
    // Add splash screen styles
    const style = document.createElement('style')
    style.textContent = `
      #splash-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-family: system-ui, -apple-system, sans-serif;
        z-index: 9999;
        transition: opacity 0.3s ease-out;
      }
      
      .splash-content {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      
      .logo-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 2rem;
      }
      
      .app-icon {
        width: 80px;
        height: 80px;
        background: #16a34a;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.5rem;
        position: relative;
        box-shadow: 0 0 20px rgba(22, 163, 74, 0.3);
      }
      
      .app-icon::before {
        content: '';
        position: absolute;
        width: 60px;
        height: 60px;
        background: rgba(22, 163, 74, 0.4);
        border-radius: 50%;
      }
      
      .app-icon::after {
        content: '';
        position: absolute;
        width: 40px;
        height: 40px;
        background: #16a34a;
        border-radius: 50%;
      }
      
      .map-pin {
        position: absolute;
        width: 24px;
        height: 24px;
        z-index: 1;
        color: white;
      }
      
      .app-name {
        font-size: 3rem;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 0.5rem;
        text-align: center;
      }
      
      .app-subtitle {
        font-size: 1.2rem;
        color: #94a3b8;
        text-align: center;
        margin-bottom: 2rem;
      }
      
      .loading-dots {
        display: flex;
        gap: 0.5rem;
      }
      
      .dot {
        width: 8px;
        height: 8px;
        background: #16a34a;
        border-radius: 50%;
        opacity: 0.6;
        animation: pulse 1.5s infinite;
      }
      
      .dot:nth-child(2) {
        animation-delay: 0.2s;
      }
      
      .dot:nth-child(3) {
        animation-delay: 0.4s;
      }
      
      @keyframes pulse {
        0%, 100% {
          opacity: 0.6;
          transform: scale(1);
        }
        50% {
          opacity: 1;
          transform: scale(1.2);
        }
      }
      
      .splash-hidden {
        opacity: 0;
        pointer-events: none;
      }
    `
    
    document.head.appendChild(style)
    document.body.appendChild(splash)
    
    // Hide splash screen after app loads
    this.hideSplashScreen()
  }
  
  hideSplashScreen() {
    // Wait for the app to be ready
    const hideSplash = () => {
      const splash = document.getElementById('splash-screen')
      if (splash) {
        splash.classList.add('splash-hidden')
        setTimeout(() => {
          splash.remove()
        }, 300)
      }
    }
    
    // Hide after DOM is ready and a short delay
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(hideSplash, 1500)
      })
    } else {
      setTimeout(hideSplash, 1500)
    }
  }
}
