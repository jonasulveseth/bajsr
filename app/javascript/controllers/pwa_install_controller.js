import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["button", "instructions", "message"]
  static classes = ["visible"]
  static values = { 
    isInstalled: Boolean,
    isIos: Boolean,
    dismissed: { type: Boolean, default: false }
  }

  connect() {
    this.deferredPrompt = null
    this.isIosValue = this.detectIos()
    this.isInstalledValue = this.detectInstalled()
    this.dismissedValue = sessionStorage.getItem('pwaBannerDismissed') === 'true'

    if (this.dismissedValue) {
      return
    }
    
    // Listen for the beforeinstallprompt event (Android/Chrome)
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      this.deferredPrompt = e
      this.showInstallButton()
    })

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      this.isInstalledValue = true
      this.hideInstallButton()
    })

    // iOS/iPadOS Safari saknar beforeinstallprompt — visa instruktioner
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent)
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true

    // På macOS Safari kan vi tipsa om "Add to Dock" (men ingen prompt finns)
    const isMacSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && navigator.platform.startsWith("Mac")

    if (!isStandalone && (isIOS || isMacSafari)) {
      if (isMacSafari) {
        this.messageTarget.innerHTML = `På macOS: välj <em>Safari ▸ File ▸ Add to Dock…</em> för att installera.`
      }
      this.show()
    }
  }

  detectIos() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  }

  detectInstalled() {
    // Check if app is running in standalone mode (installed)
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true
  }

  showInstallButton() {
    if (this.dismissedValue) return
    if (this.hasButtonTarget) {
      this.buttonTarget.classList.remove('hidden')
    }
  }

  hideInstallButton() {
    if (this.hasButtonTarget) {
      this.buttonTarget.classList.add('hidden')
    }
    if (this.hasInstructionsTarget) {
      this.instructionsTarget.classList.add('hidden')
    }
  }

  showIosInstructions() {
    if (this.hasInstructionsTarget) {
      this.instructionsTarget.classList.remove('hidden')
    }
  }

  show() { 
    if (this.dismissedValue) return
    this.element.classList.add(...this.visibleClasses) 
  }
  
  hide() { 
    this.element.classList.remove(...this.visibleClasses) 
  }

  async install() {
    if (this.deferredPrompt) {
      // Android/Chrome installation
      this.deferredPrompt.prompt()
      const { outcome } = await this.deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('PWA installation accepted')
      } else {
        console.log('PWA installation dismissed')
      }
      
      this.deferredPrompt = null
      this.hideInstallButton()
    } else if (this.isIosValue) {
      // iOS - show instructions
      this.showIosInstructions()
    }
  }

  dismissInstructions() {
    sessionStorage.setItem('pwaBannerDismissed', 'true')
    this.dismissedValue = true
    this.hide()
  }
}
