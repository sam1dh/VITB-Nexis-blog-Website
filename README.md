# VITB Nexis Blog Website

A modern, full-stack blog platform built for VITB (Vellore Institute of Technology, Bhopal) featuring a responsive frontend and robust backend API with admin panel functionality.

## 🌟 Features

### Public Features
- **Home Page**: Beautiful landing page with featured blogs
- **Blog Reading**: Individual blog post pages with rich content
- **Responsive Design**: Mobile-first design using Tailwind CSS
- **Modern UI**: Clean and intuitive user interface

### Admin Features
- **Authentication**: Secure admin login system
- **Dashboard**: Overview of blog statistics and management
- **Blog Management**: 
  - Create new blog posts with rich text editor (Quill.js)
  - Edit and delete existing blogs
  - Image upload with ImageKit integration
  - Blog categorization and publishing controls
- **Comment Management**: View and manage blog comments
- **Content Management**: Full CRUD operations for blog content

### ML-Powered Features
- **Smart Recommendations**: AI-driven blog recommendations using TF-IDF and cosine similarity
- **Content Analysis**: Automatic content similarity detection
- **Personalized Suggestions**: Context-aware article recommendations based on:
  - Title and subtitle analysis
  - Category matching
  - Content similarity scoring
  - Real-time similarity percentage display

## 🛠️ Technology Stack

### Frontend
- **React 19.1.1** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4.1.13** - Utility-first CSS framework
- **React Router DOM 7.8.2** - Client-side routing
- **Quill.js 2.0.3** - Rich text editor for blog content
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Beautiful toast notifications
- **Motion** - Animation library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5.1.0** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload middleware
- **ImageKit** - Image optimization and CDN
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
VITB-Nexis-blog-Website/
├── Frontend/                 # React frontend application
│   ├── src/
│   │   ├── Components/       # Reusable UI components
│   │   │   ├── admin/        # Admin-specific components
│   │   │   ├── Blogcard.jsx  # Blog card component
│   │   │   ├── Header.jsx    # Site header
│   │   │   ├── Footer.jsx    # Site footer
│   │   │   └── ...
│   │   ├── Pages/           # Page components
│   │   │   ├── admin/       # Admin panel pages
│   │   │   ├── Home.jsx     # Home page
│   │   │   └── Blog.jsx     # Individual blog page
│   │   ├── context/         # React context for state management
│   │   └── Assets/          # Images and static assets
│   ├── package.json
│   └── vite.config.js
├── server/                  # Node.js backend API
│   ├── configs/            # Configuration files
│   │   ├── db.js          # Database connection
│   │   └── imageKit.js    # ImageKit configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── server.js          # Main server file
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- ImageKit account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/VITB-Nexis-blog-Website.git
   cd VITB-Nexis-blog-Website
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   ```

4. **Environment Variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017
   JWT_SECRET=your_jwt_secret_key
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   PORT=3000
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd server
   npm run server  # Development mode with nodemon
   # or
   npm start       # Production mode
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd Frontend
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Admin Panel: http://localhost:5173/admin

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints
- `POST /api/admin/login` - Admin login
- `POST /api/admin/register` - Admin registration

### Blog Endpoints
- `GET /api/blog` - Get all published blogs
- `GET /api/blog/:id` - Get specific blog by ID
- `POST /api/blog` - Create new blog (Admin only)
- `PUT /api/blog/:id` - Update blog (Admin only)
- `DELETE /api/blog/:id` - Delete blog (Admin only)

### Comment Endpoints
- `GET /api/blog/:id/comments` - Get comments for a blog
- `POST /api/blog/:id/comments` - Add comment to blog
- `DELETE /api/comments/:id` - Delete comment (Admin only)

### ML Recommendation Endpoints
- `GET /api/blog/:id/recommendations` - Get ML-powered blog recommendations
- `POST /api/blog/analyze-similarity` - Analyze content similarity between blogs

## 🤖 Machine Learning Features

### TF-IDF Implementation
The blog platform includes a sophisticated recommendation system powered by:

- **Term Frequency-Inverse Document Frequency (TF-IDF)**: Analyzes blog content to identify important terms
- **Cosine Similarity**: Calculates semantic similarity between blog posts
- **Real-time Recommendations**: Provides instant article suggestions based on content analysis

### How It Works
1. **Text Preprocessing**: Converts blog titles, subtitles, and categories into tokens
2. **TF-IDF Calculation**: Computes term importance across the entire blog corpus
3. **Vector Similarity**: Uses cosine similarity to find related articles
4. **Smart Filtering**: Excludes the current article and ranks by similarity score

### Recommendation Algorithm
```javascript
// Key features of the ML implementation:
- Tokenization and text preprocessing
- Term frequency normalization
- Document frequency calculation
- IDF (Inverse Document Frequency) computation
- Cosine similarity scoring
- Top-K recommendation selection
```

### Performance Features
- **Client-side Processing**: Fast recommendations without server round-trips
- **Similarity Scoring**: Shows percentage match for transparency
- **Category Awareness**: Considers blog categories in recommendations
- **Real-time Updates**: Recommendations update as new blogs are added

## 🔧 Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend:**
- `npm run server` - Start with nodemon (development)
- `npm start` - Start production server

### Code Style
- ESLint configuration for consistent code style
- Prettier for code formatting
- Component-based architecture

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Update API endpoints to production URLs

### Backend Deployment (Railway/Heroku)
1. Set environment variables in your hosting platform
2. Deploy the `server` directory
3. Ensure MongoDB connection is configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **VITB Nexis Team** - Vellore Institute of Technology, Bhopal

## 📞 Support

For support, email your-email@vitbhopal.ac.in or create an issue in the repository.

---

**Made with ❤️ by VITB Nexis Team**