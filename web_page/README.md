# 李门家谱 Web版

Static web page for the Lee Family Tree (李门家谱).

## Features

- Interactive family tree visualization
- Pan and zoom navigation (mouse drag, scroll wheel, touch gestures)
- Search functionality
- Member detail modal with bio information
- Responsive design

## Deployment to GitHub Pages

1. Push this repository to GitHub
2. Go to **Settings** > **Pages**
3. Under "Source", select:
   - Branch: `master` (or your main branch)
   - Folder: `/web_page`
4. Click **Save**
5. Wait a few minutes for deployment
6. Access your site at `https://[username].github.io/[repo-name]/`

## Local Development

### Option 1: Direct File Access
Simply open `web_page/index.html` in a web browser.

### Option 2: Local Server
```bash
cd web_page
python -m http.server 8000
```
Then open http://localhost:8000

### Option 3: VS Code Live Server
If using VS Code, install the "Live Server" extension and click "Go Live".

## File Structure

```
web_page/
├── index.html      # Main HTML file
├── css/
│   └── style.css   # Styles
├── js/
│   ├── data.js     # Family data
│   ├── tree.js     # Tree rendering
│   ├── modal.js    # Modal functionality
│   └── main.js     # Main application
└── README.md       # This file
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Android Chrome)

## Data Format

Family data is stored in `js/data.js` as a flat array with parent IDs:

```javascript
const familyList = [
  {
    id: "1",
    pid: null,      // Parent ID (null for root)
    name: "李崇福",
    relation: "老屋",
    birth: "xxxx",
    death: "xxxx",
    bio: "老屋",
    gender: "男"
  },
  // ... more members
];
```

## Updating Family Data

1. Edit `web_page/js/data.js`
2. Add or modify entries following the existing format
3. Commit and push changes
4. GitHub Pages will automatically redeploy
