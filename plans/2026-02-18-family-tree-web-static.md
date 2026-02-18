# Family Tree Web Static Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a static web page version of the Lee Family Tree (李门家谱) application that can be deployed on GitHub Pages.

**Architecture:** Single-page application using vanilla HTML/CSS/JavaScript. The tree is rendered using recursive DOM elements with CSS flexbox layout. Pan and zoom are implemented via CSS transform on a container. Member details are shown in a modal overlay.

**Tech Stack:** Vanilla HTML5, CSS3 (flexbox, grid, animations), ES6+ JavaScript (no frameworks, no build step)

---

## Task 1: Create Directory Structure and Base HTML

**Files:**
- Create: `web_page/index.html`
- Create: `web_page/css/style.css`
- Create: `web_page/js/data.js`
- Create: `web_page/js/tree.js`
- Create: `web_page/js/modal.js`
- Create: `web_page/js/main.js`

**Step 1: Create the base HTML structure**

Create `web_page/index.html`:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>李门家谱</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header class="header">
            <h1 class="title">李门家谱</h1>
            <div class="zoom-controls">
                <button class="zoom-btn" id="zoomOut">−</button>
                <button class="zoom-btn" id="zoomIn">+</button>
            </div>
        </header>

        <!-- Search Bar -->
        <div class="search-bar">
            <input type="text" class="search-input" id="searchInput" placeholder="输入姓名查找">
            <button class="search-btn" id="searchBtn">搜索</button>
        </div>

        <!-- Tree Container -->
        <div class="canvas-container" id="canvasContainer">
            <div class="tree-container" id="treeContainer">
                <!-- Tree nodes will be rendered here -->
            </div>
        </div>

        <!-- Bottom Tip -->
        <div class="bottom-tip">
            <span>拖拽平移，滚轮缩放，点击头像查看详情</span>
        </div>

        <!-- Member Detail Modal -->
        <div class="modal-mask" id="modalMask">
            <div class="modal-content">
                <div class="modal-header">
                    <button class="close-btn" id="closeModal">×</button>
                </div>
                <div class="modal-body">
                    <div class="avatar-container">
                        <div class="avatar" id="modalAvatar">
                            <span class="avatar-text" id="modalAvatarText"></span>
                        </div>
                    </div>
                    <div class="member-info">
                        <div class="name-row">
                            <span class="name" id="modalName"></span>
                            <span class="relation-tag" id="modalRelation"></span>
                        </div>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">性别</span>
                                <span class="info-value" id="modalGender"></span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">出生年份</span>
                                <span class="info-value" id="modalBirth"></span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">离世年份</span>
                                <span class="info-value" id="modalDeath"></span>
                            </div>
                        </div>
                        <div class="bio-section">
                            <span class="bio-label">生平简介</span>
                            <p class="bio-text" id="modalBio"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading Mask -->
        <div class="loading-mask" id="loadingMask">
            <span class="loading-text">加载中...</span>
        </div>
    </div>

    <script src="js/data.js"></script>
    <script src="js/tree.js"></script>
    <script src="js/modal.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
```

**Step 2: Verify the file was created**

Check that `web_page/index.html` exists and contains the HTML structure.

**Step 3: Commit**

```bash
git add web_page/index.html
git commit -m "feat(web): create base HTML structure for family tree web page"
```

---

## Task 2: Convert and Add Family Data

**Files:**
- Create: `web_page/js/data.js`

**Step 1: Create the data file**

Copy the family data from `mini_program/miniprogram/data/family-data.js` and convert to ES6 module format. Create `web_page/js/data.js` with the familyList array.

```javascript
// Family data for Lee Family Tree
const familyList = [
  // --- 李崇福（老屋）支系数据 ---
  {
    id: "1",
    pid: null,
    name: "李崇福",
    relation: "老屋",
    birth: "xxxx",
    death: "xxxx",
    bio: "老屋",
    gender: "男",
  },
  // ... (copy all data from mini_program/miniprogram/data/family-data.js)
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { familyList };
}
```

**Step 2: Verify data loads correctly**

Open the browser console and check that `familyList` is defined and has the expected number of entries.

**Step 3: Commit**

```bash
git add web_page/js/data.js
git commit -m "feat(web): add family data for web page"
```

---

## Task 3: Create CSS Styles

**Files:**
- Create: `web_page/css/style.css`

**Step 1: Create the stylesheet**

Convert the WXSS styles to standard CSS. Create `web_page/css/style.css` with:
- Container and layout styles
- Header and title styles
- Tree node styles (avatar, label, connecting lines)
- Modal styles
- Search bar styles
- Animations

Key CSS features:
- Use flexbox for tree layout
- CSS pseudo-elements for connecting lines
- CSS transforms for pan/zoom
- CSS animations for modal

**Step 2: Verify styles apply correctly**

Check that the page has proper styling when loaded in browser.

**Step 3: Commit**

```bash
git add web_page/css/style.css
git commit -m "feat(web): add CSS styles for family tree"
```

---

## Task 4: Implement Tree Rendering

**Files:**
- Create: `web_page/js/tree.js`

**Step 1: Create the tree module**

Implement functions:
- `buildTree(flatList)` - Convert flat list to tree structure
- `renderNode(node)` - Create DOM element for a single node
- `renderTree(rootNode, container)` - Render full tree into container
- `calculateTreeSize(node)` - Calculate tree dimensions

```javascript
// Tree rendering module
const TreeRenderer = {
    buildTree(flatList) {
        // Same logic as mini_program
    },

    renderNode(node) {
        // Create DOM element with avatar, label, connecting lines
        // Recursively render children
    },

    renderTree(rootNode, container) {
        // Clear container and render tree
    },

    calculateTreeSize(node) {
        // Return { depth, leaves }
    }
};
```

**Step 2: Verify tree renders**

Open page in browser and verify tree nodes are visible.

**Step 3: Commit**

```bash
git add web_page/js/tree.js
git commit -m "feat(web): implement tree rendering"
```

---

## Task 5: Implement Pan and Zoom

**Files:**
- Modify: `web_page/js/main.js`

**Step 1: Add pan/zoom functionality**

Implement:
- Mouse drag to pan
- Mouse wheel to zoom
- Touch support for mobile (touchmove, pinch-to-zoom)
- Zoom buttons (+/-)

```javascript
// Pan and zoom state
let scale = 0.6;
let offsetX = -500;
let offsetY = -300;
let isDragging = false;
let lastX, lastY;

function updateTransform() {
    treeContainer.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
}

// Event listeners for mouse and touch
```

**Step 2: Verify pan/zoom works**

Test dragging and zooming in browser.

**Step 3: Commit**

```bash
git add web_page/js/main.js
git commit -m "feat(web): implement pan and zoom"
```

---

## Task 6: Implement Member Detail Modal

**Files:**
- Create: `web_page/js/modal.js`

**Step 1: Create the modal module**

Implement functions:
- `showModal(node)` - Display modal with member details
- `hideModal()` - Hide modal
- `updateModalContent(node)` - Fill modal with member data

```javascript
const Modal = {
    show(node) {
        // Update modal content
        // Show modal with animation
    },

    hide() {
        // Hide modal
    },

    updateContent(node) {
        // Set name, gender, birth, death, bio
        // Set avatar color based on gender/relation
    }
};
```

**Step 2: Verify modal shows on node click**

Click on tree nodes and verify modal appears with correct data.

**Step 3: Commit**

```bash
git add web_page/js/modal.js
git commit -m "feat(web): implement member detail modal"
```

---

## Task 7: Implement Search Functionality

**Files:**
- Modify: `web_page/js/main.js`

**Step 1: Add search functionality**

Implement:
- `findNodeByName(node, name)` - Recursive search
- `centerOnNode(node)` - Pan/zoom to show node
- Search button click handler

```javascript
function findNodeByName(node, name) {
    if (!node) return null;
    if (node.name === name) return node;
    if (node.wife && node.wife.name === name) return node;

    if (node.children) {
        for (const child of node.children) {
            const found = findNodeByName(child, name);
            if (found) return found;
        }
    }
    return null;
}
```

**Step 2: Verify search works**

Enter a name and verify tree pans to that node.

**Step 3: Commit**

```bash
git add web_page/js/main.js
git commit -m "feat(web): implement search functionality"
```

---

## Task 8: Initialize Main Application

**Files:**
- Create: `web_page/js/main.js`

**Step 1: Create main initialization**

Initialize all components:
- Load family data
- Build and render tree
- Setup event listeners
- Initialize pan/zoom
- Hide loading mask

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // Load data and build tree
    const treeData = TreeRenderer.buildTree(familyList);

    // Render tree
    TreeRenderer.renderTree(treeData, document.getElementById('treeContainer'));

    // Setup event listeners
    setupPanZoom();
    setupModal();
    setupSearch();

    // Hide loading
    document.getElementById('loadingMask').style.display = 'none';
});
```

**Step 2: Verify application initializes**

Refresh page and verify everything works together.

**Step 3: Commit**

```bash
git add web_page/js/main.js
git commit -m "feat(web): initialize main application"
```

---

## Task 9: Add GitHub Pages Deployment Config

**Files:**
- Create: `web_page/README.md`

**Step 1: Create README with deployment instructions**

```markdown
# 李门家谱 Web版

Static web page for the Lee Family Tree.

## Deployment

1. Push to GitHub
2. Go to Settings > Pages
3. Select branch and `/web_page` folder
4. Save

## Local Development

Open `index.html` in a browser or use a local server:

```bash
cd web_page
python -m http.server 8000
```

Then open http://localhost:8000
```

**Step 2: Commit**

```bash
git add web_page/README.md
git commit -m "docs(web): add README with deployment instructions"
```

---

## Task 10: Final Testing and Review

**Step 1: Test in multiple browsers**
- Chrome
- Firefox
- Safari
- Edge

**Step 2: Test on mobile**
- Touch pan
- Pinch zoom
- Modal display

**Step 3: Verify GitHub Pages deployment**
- Push changes
- Enable GitHub Pages
- Test live URL

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat(web): complete family tree static web page"
```
