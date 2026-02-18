// Main application for Lee Family Tree (李门家谱)

(function() {
    'use strict';

    // State
    let treeData = null;
    let scale = 0.6;
    let offsetX = -500;
    let offsetY = -300;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let currentTab = 'tree';

    // DOM Elements
    let treeContainer = null;
    let treeContent = null;
    let loadingMask = null;

    /**
     * Initialize the application
     */
    function init() {
        // Get DOM elements
        treeContainer = document.getElementById('treeContainer');
        loadingMask = document.getElementById('loadingMask');

        // Initialize modal
        if (typeof Modal !== 'undefined') {
            Modal.init();
        }

        // Setup tabs
        setupTabs();

        // Load and render tree
        loadTree();

        // Setup event listeners
        setupZoomControls();
        setupPanZoom();
        setupSearch();
    }

    /**
     * Setup tab navigation
     */
    function setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                switchTab(tabId);
            });
        });
    }

    /**
     * Switch to a different tab
     * @param {string} tabId - Tab identifier
     */
    function switchTab(tabId) {
        // Update button states
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });

        // Update content visibility
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tabId}`);
        });

        currentTab = tabId;

        // Reinitialize tree if switching to tree tab
        if (tabId === 'tree' && treeContent) {
            updateTransform();
        }
    }

    /**
     * Load and render the family tree
     */
    function loadTree() {
        if (typeof familyList === 'undefined') {
            console.error('Family data not loaded');
            hideLoading();
            return;
        }

        // Create tree content wrapper
        treeContent = document.createElement('div');
        treeContent.className = 'tree-content';
        treeContainer.appendChild(treeContent);

        // Build tree structure
        treeData = TreeRenderer.buildTree(familyList);

        // Render tree
        TreeRenderer.renderTree(treeData, treeContent, onNodeClick);

        // Apply initial transform
        updateTransform();

        // Hide loading
        hideLoading();
    }

    /**
     * Handle node click
     * @param {Object} node - Clicked node data
     */
    function onNodeClick(node) {
        if (typeof Modal !== 'undefined') {
            Modal.show(node);
        }
    }

    /**
     * Setup zoom control buttons
     */
    function setupZoomControls() {
        const zoomInBtn = document.getElementById('zoomIn');
        const zoomOutBtn = document.getElementById('zoomOut');

        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                scale = Math.min(scale + 0.1, 2);
                updateTransform();
            });
        }

        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                scale = Math.max(scale - 0.1, 0.3);
                updateTransform();
            });
        }
    }

    /**
     * Setup pan and zoom functionality
     */
    function setupPanZoom() {
        // Mouse events
        treeContainer.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        // Wheel zoom
        treeContainer.addEventListener('wheel', onWheel, { passive: false });

        // Touch events
        treeContainer.addEventListener('touchstart', onTouchStart, { passive: false });
        treeContainer.addEventListener('touchmove', onTouchMove, { passive: false });
        treeContainer.addEventListener('touchend', onTouchEnd);
    }

    /**
     * Mouse down handler
     */
    function onMouseDown(e) {
        if (currentTab !== 'tree') return;

        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        treeContent.style.cursor = 'grabbing';
    }

    /**
     * Mouse move handler
     */
    function onMouseMove(e) {
        if (!isDragging || currentTab !== 'tree') return;

        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;

        offsetX += dx;
        offsetY += dy;

        lastX = e.clientX;
        lastY = e.clientY;

        updateTransform();
    }

    /**
     * Mouse up handler
     */
    function onMouseUp() {
        isDragging = false;
        if (treeContent) {
            treeContent.style.cursor = 'grab';
        }
    }

    /**
     * Wheel handler for zoom
     */
    function onWheel(e) {
        if (currentTab !== 'tree') return;

        e.preventDefault();

        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newScale = Math.max(0.3, Math.min(2, scale + delta));

        // Zoom towards cursor position
        const rect = treeContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const scaleRatio = newScale / scale;
        offsetX = x - (x - offsetX) * scaleRatio;
        offsetY = y - (y - offsetY) * scaleRatio;

        scale = newScale;
        updateTransform();
    }

    // Touch state
    let lastTouchDistance = 0;
    let lastTouchX = 0;
    let lastTouchY = 0;

    /**
     * Touch start handler
     */
    function onTouchStart(e) {
        if (currentTab !== 'tree') return;

        if (e.touches.length === 1) {
            isDragging = true;
            lastTouchX = e.touches[0].clientX;
            lastTouchY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
            isDragging = false;
            lastTouchDistance = getTouchDistance(e.touches);
        }
    }

    /**
     * Touch move handler
     */
    function onTouchMove(e) {
        if (currentTab !== 'tree') return;

        e.preventDefault();

        if (e.touches.length === 1 && isDragging) {
            const dx = e.touches[0].clientX - lastTouchX;
            const dy = e.touches[0].clientY - lastTouchY;

            offsetX += dx;
            offsetY += dy;

            lastTouchX = e.touches[0].clientX;
            lastTouchY = e.touches[0].clientY;

            updateTransform();
        } else if (e.touches.length === 2) {
            const distance = getTouchDistance(e.touches);
            const delta = (distance - lastTouchDistance) * 0.005;
            scale = Math.max(0.3, Math.min(2, scale + delta));
            lastTouchDistance = distance;
            updateTransform();
        }
    }

    /**
     * Touch end handler
     */
    function onTouchEnd() {
        isDragging = false;
    }

    /**
     * Get distance between two touch points
     */
    function getTouchDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Update transform
     */
    function updateTransform() {
        if (treeContent) {
            treeContent.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
        }
    }

    /**
     * Setup search functionality
     */
    function setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');

        if (searchBtn) {
            searchBtn.addEventListener('click', performSearch);
        }

        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        }
    }

    /**
     * Perform search
     */
    function performSearch() {
        const searchInput = document.getElementById('searchInput');
        const name = searchInput.value.trim();

        if (!name || !treeData) return;

        // Switch to tree tab first
        switchTab('tree');

        const found = TreeRenderer.findNodeByName(treeData, name);

        if (found) {
            // Highlight and center on found node
            TreeRenderer.highlightNode(found.id);

            // Center the view on the node
            centerOnNode(found.id);
        } else {
            alert('未找到: ' + name);
        }
    }

    /**
     * Center view on a node
     * @param {string} nodeId - Node ID to center on
     */
    function centerOnNode(nodeId) {
        const nodeElement = document.querySelector(`[data-id="${nodeId}"]`);
        if (!nodeElement || !treeContainer) return;

        const containerRect = treeContainer.getBoundingClientRect();
        const nodeRect = nodeElement.getBoundingClientRect();

        // Calculate center position
        const nodeCenterX = nodeRect.left + nodeRect.width / 2;
        const nodeCenterY = nodeRect.top + nodeRect.height / 2;

        const containerCenterX = containerRect.left + containerRect.width / 2;
        const containerCenterY = containerRect.top + containerRect.height / 2;

        // Adjust offset to center the node
        offsetX += containerCenterX - nodeCenterX;
        offsetY += containerCenterY - nodeCenterY;

        updateTransform();
    }

    /**
     * Hide loading mask
     */
    function hideLoading() {
        if (loadingMask) {
            loadingMask.classList.add('hidden');
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
