# Bidaya Admin Panel Setup

This folder contains the Bidaya website with an admin panel for managing content. To make changes permanent, you need to run a server.

## 🚀 Quick Start

### Option 1: Node.js Server (Recommended)

1. **Install Node.js** (if not already installed):
   - Download from https://nodejs.org/
   - Choose the LTS version

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Open your website**:
   - Website: http://localhost:3000/index.html
   - Admin Panel: http://localhost:3000/admin.html

### Option 2: PHP Server

1. **Install PHP** (if not already installed)
2. **Start PHP built-in server**:
   ```bash
   php -S localhost:8000
   ```

3. **Open your website**:
   - Website: http://localhost:8000/index.html
   - Admin Panel: http://localhost:8000/admin.html

## 📝 How to Use Admin Panel

1. **Access Admin Panel**:
   - Click the "🔧 Admin" link in the website footer
   - Or go directly to `/admin.html`

2. **Login**:
   - Password: `bidaya2025`

3. **Make Changes**:
   - Edit statistics (student count, countries, events)
   - Add/edit/remove team members
   - Manage HODs and their teams

4. **Save Changes**:
   - Click "💾 Save All Changes"
   - If server is running: Changes save permanently ✅
   - If no server: Downloads file for manual upload ⬇️

## 🔧 Files

- `index.html` - Main website
- `team.html` - Team page
- `admin.html` - Admin panel
- `data.json` - All editable content
- `server.js` - Node.js server
- `save-data.php` - PHP save script
- `styles.css` - Website styling
- `script.js` - Website functionality

## 🛡️ Security

- Admin panel is password protected
- Default password: `bidaya2025`
- Change password in `admin.html` (line with `ADMIN_PASSWORD`)

## 📞 Support

If you need help, contact the Bidaya development team!