# Bajsr Setup Guide

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Database
DATABASE_URL=sqlite3:db/development.sqlite3

# Google Maps API Key (required for map functionality)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Rails Master Key (for credentials)
RAILS_MASTER_KEY=your_rails_master_key_here

# Application URL
APP_URL=http://localhost:3000

# Environment
RAILS_ENV=development
```

## Getting Started

1. **Install dependencies:**
   ```bash
   bundle install
   ```

2. **Set up the database:**
   ```bash
   bin/rails db:create
   bin/rails db:migrate
   ```

3. **Start the development server:**
   ```bash
   bin/dev
   ```

4. **Visit the application:**
   Open http://localhost:3000 in your browser

## Google Maps Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Maps JavaScript API
4. Create credentials (API Key)
5. Add the API key to your `.env` file

## Features Implemented

✅ **Authentication System** - Rails 8's new authentication platform
✅ **Pin Management** - Create, read, update, delete pins with images
✅ **Map Integration** - Google Maps with interactive pins
✅ **Group System** - Create groups and invite members
✅ **PWA Support** - Progressive Web App with manifest and service worker
✅ **Responsive Design** - TailwindCSS with mobile-first approach
✅ **Image Upload** - Active Storage with validation
✅ **Real-time Updates** - Hotwire (Turbo + Stimulus)

## Deployment

For production deployment, consider using:
- **Fly.io** - Easy Rails deployment
- **Render** - Simple cloud platform
- **Heroku** - Traditional Rails hosting

Remember to:
1. Set up PostgreSQL for production
2. Configure environment variables
3. Set up a custom domain (bajsr.com)
4. Enable SSL certificates
5. Configure Google Maps API key for production domain

## Testing Offline Support

The PWA includes basic offline functionality:
1. Install the app on your mobile device
2. Turn off internet connection
3. Navigate to previously visited pages
4. The app should work offline with cached content 