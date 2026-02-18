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

    // DOM Elements
    let treeContainer = null;
    let canvasContainer = null;
    let loadingMask = null;

    /**
     * Initialize the application
     */
    function init() {
        // Get DOM elements
        treeContainer = document.getElementById('treeContainer');
        canvasContainer = document.getElementById('canvasContainer');
        loadingMask = document.getElementById('loadingMask');

        // Initialize modal
        if (typeof Modal !== 'undefined') {
            Modal.init();
        }

        // Load and render tree
        loadTree();

        // Setup event listeners
        setupZoomControls();
        setupPanZoom();
        setupSearch();
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

        // Build tree structure
        treeData = TreeRenderer.buildTree(familyList);

        // Render tree
        TreeRenderer.renderTree(treeData, treeContainer, onNodeClick);

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
        canvasContainer.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        // Wheel zoom
        canvasContainer.addEventListener('wheel', onWheel, { passive: false });

        // Touch events
        canvasContainer.addEventListener('touchstart', onTouchStart, { passive: false });
        canvasContainer.addEventListener('touchmove', onTouchMove, { passive: false });
        canvasContainer.addEventListener('touchend', onTouchEnd);
    }

    /**
     * Mouse down handler
     */
    function onMouseDown(e) {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        treeContainer.style.cursor = 'grabbing';
    }

    /**
     * Mouse move handler
     */
    function onMouseMove(e) {
        if (!isDragging) return;

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
        treeContainer.style.cursor = 'grab';
    }

    /**
     * Wheel handler for zoom
     */
    function onWheel(e) {
        e.preventDefault();

        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newScale = Math.max(0.3, Math.min(2, scale + delta));

        // Zoom towards cursor position
        const rect = canvasContainer.getBoundingClientRect();
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
        if (treeContainer) {
            treeContainer.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
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
        if (!nodeElement) return;

        const containerRect = canvasContainer.getBoundingClientRect();
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
