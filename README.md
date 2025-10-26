# Project Bidaya 2.0

A comprehensive student innovation platform with team management, admin panel, and MongoDB integration.

## 🚀 Features

### **Frontend**
- **Modern responsive website** with glassmorphism design
- **Team showcase** with dynamic role-based filtering
- **Interactive leadership section** with highlighted role badges
- **Contact forms** with validation
- **Mobile-responsive** navigation and layouts

### **Admin Panel**
- **Secure authentication** with bcrypt password hashing
- **Team management** (CRUD operations)
- **Real-time data updates** with MongoDB integration
- **Role-based access control**
- **Statistics dashboard**

### **Backend**
- **MongoDB Atlas** integration for data persistence
- **Serverless API** deployed on Vercel
- **RESTful endpoints** for data management
- **Secure password handling** with salt rounds
- **Data migration tools**

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, MongoDB, Vercel Serverless Functions
- **Database**: MongoDB Atlas
- **Authentication**: bcryptjs
- **Deployment**: Vercel
- **Version Control**: Git, GitHub

## 📁 Project Structure

```
project-bidaya/
├── api/                    # Serverless API endpoints
│   ├── get-data.js        # Fetch team data
│   ├── save-data.js       # Update team data
│   ├── login.js           # Authentication
│   └── ...
├── public/                 # Frontend assets
│   ├── index.html         # Main website
│   ├── team.html          # Team showcase
│   ├── admin.html         # Admin panel
│   ├── styles.css         # Main styles
│   ├── script.js          # Frontend logic
│   └── images/            # Logo assets
├── vercel.json            # Vercel configuration
├── package.json           # Dependencies
└── README.md              # This file
```

## 🔧 Setup & Development

### **Prerequisites**
- Node.js 18+
- MongoDB Atlas account
- Vercel account (for deployment)

### **Environment Variables**
Create a `.env` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

### **Local Development**
```bash
# Install dependencies
npm install

# Start local development server
vercel dev

# Or use Python for static files
python -m http.server 8000
```

### **Deployment**
```bash
# Deploy to Vercel
npm run deploy
# or
vercel --prod
```

## 📊 Database Schema

### **Main Data Collection**
```javascript
{
  _id: "main",
  stats: {
    totalMembers: Number,
    activeProjects: Number,
    // ...
  },
  teamMembers: [
    {
      name: String,
      role: String,
      roleClass: String,      // "leadership-card" | "department-card"
      roleStyle: String,      // "founder-role" | "cofounder-role" | etc.
      description: String,
      avatar: String,
      // ...
    }
  ],
  lastUpdated: ISOString
}
```

### **Users Collection**
```javascript
{
  username: String,
  password: String,        // bcrypt hashed
  role: String,
  name: String,
  department: String
}
```

## 🎨 Current Team Structure

### **Leadership**
- **Founder & CEO**: Huzaifa (Pink-purple gradient badge)
- **Co-Founders**: Atharv, Sameer (Orange-pink gradient badges)
- **Ambassador**: Mansoor (Cyan-green gradient badge)

### **Department Heads**
- **Operations**: Rama
- **Marketing**: Yusuf  
- **Tech**: Sim
- **Finance**: Hamza
- **HR**: Ibrahim

## 🔐 Admin Access

Default admin credentials are stored in MongoDB with bcrypt hashing. Access the admin panel at `/admin.html`.

## 🚀 API Endpoints

- `GET /api/get-data` - Fetch team data
- `POST /api/save-data` - Update team data (authenticated)
- `POST /api/login` - User authentication
- `GET /api/get-users` - Fetch users (authenticated)
- `POST /api/test-connection` - Test MongoDB connection

## 🎯 Prototyping Ready

This codebase is optimized for rapid prototyping:
- **Modular architecture** for easy feature additions
- **Clean separation** between frontend and backend
- **Comprehensive API** for external integrations
- **Flexible data models** for quick iterations
- **Modern deployment** pipeline with Vercel

## 📈 Recent Updates

- Enhanced role badge styling with gradients
- Improved team card sizing and spacing
- Added comprehensive admin panel
- Implemented secure authentication
- Optimized for mobile responsiveness
- Added data migration tools

## 🤝 Contributing

This is a private repository for Project Bidaya development. Contact the team leads for contribution guidelines.

## 📄 License

MIT License - see LICENSE file for details.

---

**Project Bidaya** - Empowering young innovators through collaboration, learning, and real-world impact.