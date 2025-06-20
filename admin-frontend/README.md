# WordPress Admin Dashboard

A modern Next.js admin dashboard for managing blog posts across multiple WordPress websites.

## Features

- 🔐 **Authentication**: JWT-based login system
- 📝 **Rich Text Editor**: Quill.js integration for content creation
- 🖼️ **Image Upload**: Featured image upload with preview
- 🎯 **Multi-site Publishing**: Publish to multiple WordPress sites
- 📊 **Dashboard**: Overview of posts and statistics
- 🔍 **SEO Optimization**: Meta title, description, and slug management
- 📱 **Responsive Design**: Mobile-friendly interface
- 🎨 **Modern UI**: Built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Rich Text**: React Quill
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Authentication**: JWT with js-cookie

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API server running

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd admin-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
admin-frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Dashboard page
│   │   ├── login/              # Login page
│   │   ├── posts/              # Blog posts management
│   │   │   ├── new/            # Create new post
│   │   │   └── edit/[id]/      # Edit existing post
│   │   ├── settings/           # Settings page
│   │   ├── globals.css         # Global styles
│   │   ├── layout.js           # Root layout
│   │   └── page.js             # Home page
│   ├── components/             # Reusable components
│   │   ├── ImageUpload.js      # Image upload component
│   │   ├── Layout.js           # Main layout with sidebar
│   │   ├── ProtectedRoute.js   # Route protection
│   │   └── RichTextEditor.js   # Quill.js wrapper
│   ├── context/                # React contexts
│   │   └── AuthContext.js      # Authentication context
│   ├── hooks/                  # Custom hooks
│   └── lib/                    # Utilities
│       └── api.js              # API client configuration
├── public/                     # Static assets
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── package.json                # Dependencies and scripts
```

## Pages Overview

### 🏠 Dashboard (`/dashboard`)
- Overview statistics (total posts, published, drafts)
- Recent posts list
- Quick actions

### 📝 Blog Posts (`/posts`)
- List all blog posts with search functionality
- Filter by status, date, target sites
- Edit and delete actions
- Pagination support

### ➕ Create Post (`/posts/new`)
- Rich text editor for content
- Featured image upload
- SEO fields (meta title, description, slug)
- Multi-site selection
- Save as draft or publish

### ✏️ Edit Post (`/posts/edit/[id]`)
- Edit existing posts
- All features from create post
- Delete post option
- Status management

### ⚙️ Settings (`/settings`)
- General dashboard settings
- WordPress sites management
- User preferences
- Email notifications

### 🔐 Login (`/login`)
- Email/password authentication
- JWT token management
- Redirect to dashboard on success

## API Integration

The dashboard expects a backend API with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Blog Posts
- `GET /api/posts` - List posts (with pagination)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/upload` - Upload image

### WordPress Sites
- `GET /api/sites` - List connected WordPress sites

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api` |

## Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `src/app/globals.css` for global styles
- Colors are defined in the Tailwind config under `theme.extend.colors`

### Rich Text Editor
- Customize toolbar options in `src/components/RichTextEditor.js`
- Add custom formats and modules as needed

### WordPress Sites
- Update the mock data in components to match your actual WordPress sites
- Modify the site selection UI in post creation/editing forms

## Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload the 'out' directory to Netlify
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email your-email@example.com or create an issue in the repository.

