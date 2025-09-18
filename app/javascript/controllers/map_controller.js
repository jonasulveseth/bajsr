import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["map", "latitude", "longitude"]
  static values = { 
    center: { type: Object, default: { lat: 59.3293, lng: 18.0686 } }, // Stockholm default
    zoom: { type: Number, default: 10 },
    pins: { type: Array, default: [] }
  }

  connect() {
    this.initializeMap()
  }

  initializeMap() {
    if (typeof google === 'undefined') {
      console.warn('Google Maps API not loaded')
      return
    }

    this.map = new google.maps.Map(this.mapTarget, {
      center: this.centerValue,
      zoom: this.zoomValue,
      styles: this.getMapStyles()
    })

    // Add click listener to add pins
    this.map.addListener('click', (event) => {
      this.addPin(event.latLng)
    })

    // Load existing pins if any
    this.loadPins()
    
    // Add pins from data if available
    if (this.hasPinsValue && this.pinsValue.length > 0) {
      this.pinsValue.forEach(pinData => {
        this.addPinFromData(pinData)
      })
    }
  }

  addPin(latLng) {
    const marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      draggable: true,
      title: 'New Pin'
    })

    // Update form fields if they exist
    if (this.hasLatitudeTarget && this.hasLongitudeTarget) {
      this.latitudeTarget.value = latLng.lat()
      this.longitudeTarget.value = latLng.lng()
    }

    // Add info window
    const infoWindow = new google.maps.InfoWindow({
      content: '<div class="p-2"><h3 class="font-bold">New Pin</h3><p>Click to edit details</p></div>'
    })

    marker.addListener('click', () => {
      infoWindow.open(this.map, marker)
    })

    return marker
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#16a34a"/>
            <circle cx="12" cy="9" r="2.5" fill="white"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(24, 24),
        anchor: new google.maps.Point(12, 24)
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
} 