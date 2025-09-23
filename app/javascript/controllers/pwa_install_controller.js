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
    const storageDismissed = sessionStorage.getItem('pwaInstallDismissed') === 'true'
    const cookieDismissed = document.cookie.split('; ').some((cookie) => cookie.startsWith('hide_pwa_banner='))
    this.dismissedValue = storageDismissed || cookieDismissed || this.element.dataset.dismissed === 'true'
    console.log('[PWA Install] connect — session:', this.element.dataset.dismissed, 'storage:', storageDismissed, 'cookie:', cookieDismissed)

    // Listen for the beforeinstallprompt event (Android/Chrome)
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      this.deferredPrompt = e
      console.log('[PWA Install] beforeinstallprompt fired')
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

    if (!this.dismissedValue && !isStandalone && (isIOS || isMacSafari)) {
      if (isMacSafari) {
        this.messageTarget.innerHTML = `På macOS: välj <em>Safari ▸ File ▸ Add to Dock…</em> för att installera.`
      }
      console.log('[PWA Install] showing instructions banner')
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
    if (!this.dismissedValue && this.hasButtonTarget) {
      console.log('[PWA Install] showing install button')
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
    console.log('[PWA Install] show() called')
    this.element.classList.add(...this.visibleClasses)
    this.element.classList.remove('pointer-events-none')
  }
  
  hide() { 
    console.log('[PWA Install] hide() called')
    this.element.classList.remove(...this.visibleClasses)
    this.element.classList.add('pointer-events-none')
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
    sessionStorage.setItem('pwaInstallDismissed', 'true')
    this.dismissedValue = true
    this.element.dataset.dismissed = 'true'
    this.hide()
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content
    console.log('[PWA Install] dismissInstructions() posting to server')
    document.cookie = 'hide_pwa_banner=1; path=/; max-age=604800'
    fetch('/pwa_install/dismiss', {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken,
        'Accept': 'application/json'
      },
      credentials: 'same-origin'
    }).then((response) => {
      console.log('[PWA Install] server dismissal response status:', response.status)
      return response.json().catch(() => ({}))
    }).then((data) => {
      console.log('[PWA Install] server dismissal payload:', data)
    }).catch((error) => {
      console.warn('[PWA Install] Could not persist banner dismissal', error)
    })
  }
}
