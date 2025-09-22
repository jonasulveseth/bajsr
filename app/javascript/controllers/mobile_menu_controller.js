import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["menu", "overlay", "hamburger"]
  static classes = ["open", "closed"]

  connect() {
    // Close menu when clicking outside
    document.addEventListener('click', this.handleOutsideClick.bind(this))
  }

  disconnect() {
    document.removeEventListener('click', this.handleOutsideClick.bind(this))
  }

  toggle() {
    if (this.isOpen()) {
      this.close()
    } else {
      this.open()
    }
  }

  open() {
    this.menuTarget.classList.remove('translate-x-full')
    this.menuTarget.classList.add('translate-x-0')
    this.overlayTarget.classList.remove('hidden')
    this.overlayTarget.classList.add('block')
    document.body.classList.add('overflow-hidden')
    
    // Animate hamburger to X
    this.hamburgerTarget.classList.add('rotate-45')
    this.hamburgerTarget.querySelector('.line-1').classList.add('rotate-90', '-translate-y-1')
    this.hamburgerTarget.querySelector('.line-2').classList.add('opacity-0')
    this.hamburgerTarget.querySelector('.line-3').classList.add('-rotate-90', 'translate-y-1')
  }

  close() {
    this.menuTarget.classList.remove('translate-x-0')
    this.menuTarget.classList.add('translate-x-full')
    this.overlayTarget.classList.remove('block')
    this.overlayTarget.classList.add('hidden')
    document.body.classList.remove('overflow-hidden')
    
    // Reset hamburger
    this.hamburgerTarget.classList.remove('rotate-45')
    this.hamburgerTarget.querySelector('.line-1').classList.remove('rotate-90', '-translate-y-1')
    this.hamburgerTarget.querySelector('.line-2').classList.remove('opacity-0')
    this.hamburgerTarget.querySelector('.line-3').classList.remove('-rotate-90', 'translate-y-1')
  }

  isOpen() {
    return this.menuTarget.classList.contains('translate-x-0')
  }

  handleOutsideClick(event) {
    if (this.isOpen() && !this.element.contains(event.target)) {
      this.close()
    }
  }
}


