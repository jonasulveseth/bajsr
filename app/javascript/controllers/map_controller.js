import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["map", "latitude", "longitude", "panel"]
  static values = { 
    center: { type: Object, default: { lat: 59.3293, lng: 18.0686 } }, // Stockholm default
    zoom: { type: Number, default: 10 },
    pins: { type: Array, default: [] }
  }

  connect() {
    if (typeof window.google === 'undefined' || typeof window.google.maps === 'undefined') {
      this.enqueueInitialization()
      return
    }

    this.initializeMap()
    // Show panel immediately for new pin form
    if (window.location.pathname.includes('/pins/new')) {
      setTimeout(() => this.showPanel(), 1000)
    }
  }

  disconnect() {
    if (this.pendingInitialization) {
      window._initGoogleMapsQueue = (window._initGoogleMapsQueue || []).filter(callback => callback !== this.pendingInitialization)
      this.pendingInitialization = null
    }
  }

  enqueueInitialization() {
    window._initGoogleMapsQueue = window._initGoogleMapsQueue || []
    this.pendingInitialization = () => {
      if (typeof window.google !== 'undefined' && typeof window.google.maps !== 'undefined') {
        this.initializeMap()
        this.pendingInitialization = null
      }
    }
    window._initGoogleMapsQueue.push(this.pendingInitialization)
  }

  initializeMap() {
    this.map = new google.maps.Map(this.mapTarget, {
      center: this.centerValue,
      zoom: this.zoomValue,
      styles: this.getMapStyles()
    })

    this.tryGeolocation()

    // Add click listener to add pins
    this.map.addListener('click', (event) => {
      this.handleMapClick(event)
    })

    // Load existing pins if any
    this.loadPins()
    
    // Add pins from data if available
    if (this.hasPinsValue && this.pinsValue.length > 0) {
      this.pinsValue.forEach(pinData => {
        this.addPinFromData(pinData)
      })
    }

    if (this.hasLatitudeTarget && this.hasLongitudeTarget && this.latitudeTarget.value && this.longitudeTarget.value) {
      const position = new google.maps.LatLng(parseFloat(this.latitudeTarget.value), parseFloat(this.longitudeTarget.value))
      this.placeSingleMarker(position)
      this.map.panTo(position)
      this.showPanel()
    }
  }

  tryGeolocation() {
    if (!navigator.geolocation) {
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
        this.map.setCenter(coords)
        this.map.setZoom(16)

        if (!(this.hasLatitudeTarget && this.hasLongitudeTarget && (this.latitudeTarget.value || this.longitudeTarget.value))) {
          this.placeSingleMarker(coords)
          this.showPanel()
        }
      },
      (error) => {
        console.warn('Geolocation failed:', error)
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    )
  }

  handleMapClick(event) {
    if (!(this.hasLatitudeTarget && this.hasLongitudeTarget)) {
      return
    }

    this.placeSingleMarker(event.latLng)
    this.showPanel()
  }

  placeSingleMarker(latLng) {
    if (this.currentMarker) {
      this.currentMarker.setMap(null)
    }

    const marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      draggable: true,
      title: 'New Pin',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="30" fill="#8b5e3c"/>
            <path d="M28 14c0-4 4-7 6-7 3 0 7 3 7 7 0 2-1 4-1 4s7 1 7 7c0 5-5 7-5 7s5 2 5 7c0 5-5 7-5 7s4 2 4 7c0 6-7 10-14 10s-14-4-14-10c0-5 4-7 4-7s-5-2-5-7c0-5 5-7 5-7s-6-2-6-7c0-6 7-7 7-7s-2-2-2-4z" fill="#6b4429"/>
            <circle cx="26" cy="28" r="3" fill="#fff"/>
            <circle cx="38" cy="28" r="3" fill="#fff"/>
            <circle cx="26" cy="27" r="1.2" fill="#2f1b0f"/>
            <circle cx="38" cy="27" r="1.2" fill="#2f1b0f"/>
            <path d="M24 40c3 4 13 4 16 0" stroke="#2f1b0f" stroke-width="3" stroke-linecap="round" fill="none"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 24)
      }
    })

    this.currentMarker = marker

    // Update form fields if they exist
    if (this.hasLatitudeTarget && this.hasLongitudeTarget) {
      this.updateCoordinates(latLng)
    }

    // Add info window
    const infoWindow = new google.maps.InfoWindow({
      content: '<div class="p-2"><h3 class="font-bold">New Pin</h3><p>Click to edit details</p></div>'
    })

    marker.addListener('click', () => {
      infoWindow.open(this.map, marker)
    })

    marker.addListener('dragend', () => {
      this.updateCoordinates(marker.getPosition())
    })

    return marker
  }

  updateCoordinates(latLng) {
    if (this.hasLatitudeTarget) {
      this.latitudeTarget.value = latLng.lat()
    }

    if (this.hasLongitudeTarget) {
      this.longitudeTarget.value = latLng.lng()
    }
  }

  loadPins() {
    // This will be implemented when we have pins in the database
    // For now, it's a placeholder
  }

  addPinFromData(pinData) {
    const position = { lat: parseFloat(pinData.lat), lng: parseFloat(pinData.lng) }
    
    const marker = new google.maps.Marker({
      position: position,
      map: this.map,
      title: `Pin by ${pinData.user}`,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="30" fill="#8b5e3c"/>
            <path d="M28 14c0-4 4-7 6-7 3 0 7 3 7 7 0 2-1 4-1 4s7 1 7 7c0 5-5 7-5 7s5 2 5 7c0 5-5 7-5 7s4 2 4 7c0 6-7 10-14 10s-14-4-14-10c0-5 4-7 4-7s-5-2-5-7c0-5 5-7 5-7s-6-2-6-7c0-6 7-7 7-7s-2-2-2-4z" fill="#6b4429"/>
            <circle cx="26" cy="28" r="3" fill="#fff"/>
            <circle cx="38" cy="28" r="3" fill="#fff"/>
            <circle cx="26" cy="27" r="1.2" fill="#2f1b0f"/>
            <circle cx="38" cy="27" r="1.2" fill="#2f1b0f"/>
            <path d="M24 40c3 4 13 4 16 0" stroke="#2f1b0f" stroke-width="3" stroke-linecap="round" fill="none"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 24)
      }
    })

    // Create info window content
    let content = `
      <div class="p-4 max-w-sm">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-bold text-gray-900">Pin by ${pinData.user}</h3>
          <div class="flex">
            ${Array(5).fill().map((_, i) => 
              `<svg class="w-4 h-4 ${i < pinData.rating ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>`
            ).join('')}
          </div>
        </div>
        <p class="text-gray-700 text-sm mb-2">${pinData.comment}</p>
        <p class="text-gray-500 text-xs mb-3">${pinData.created_at}</p>
    `

    if (pinData.image_url) {
      content += `<img src="${pinData.image_url}" class="w-full h-32 object-cover rounded mb-3" alt="Pin image">`
    }

    content += `
        <a href="${pinData.show_url}" class="inline-block bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
          View Details
        </a>
      </div>
    `

    const infoWindow = new google.maps.InfoWindow({
      content: content
    })

    marker.addListener('click', () => {
      infoWindow.open(this.map, marker)
    })

    return marker
  }

  getMapStyles() {
    return [
      {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#242f3e"
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "lightness": -80
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#746855"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#38414e"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#d59563"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#38414e"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#212a37"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9ca5b3"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#17263c"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#515c6d"
          }
        ]
      }
    ]
  }

  showPanel() {
    if (this.hasPanelTarget) {
      this.panelTarget.classList.remove('hidden')
      this.panelTarget.classList.add('flex')
    }
  }
}
