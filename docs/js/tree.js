// Tree rendering module for Lee Family Tree (李门家谱)

const TreeRenderer = {
    /**
     * Build tree structure from flat list
     * @param {Array} flatList - Array of family members with id and pid
     * @returns {Array} Array of root nodes with children nested
     */
    buildTree(flatList) {
        const nodeMap = {};
        const roots = [];

        // Create a map of all nodes
        flatList.forEach(item => {
            nodeMap[item.id] = { ...item, children: [] };
        });

        // Build tree structure
        flatList.forEach(item => {
            if (item.pid === null || item.pid === undefined) {
                // Root node
                roots.push(nodeMap[item.id]);
            } else if (nodeMap[item.pid]) {
                // Add to parent's children
                nodeMap[item.pid].children.push(nodeMap[item.id]);
            }
        });

        return roots;
    },

    /**
     * Create DOM element for a single node
     * @param {Object} node - Node data
     * @param {Function} onNodeClick - Click callback
     * @returns {HTMLElement} DOM element
     */
    renderNode(node, onNodeClick) {
        const container = document.createElement('div');
        container.className = 'node-container';
        container.dataset.id = node.id;

        const nodeContent = document.createElement('div');
        nodeContent.className = 'node-content';

        // Create couple container to hold husband and wife
        const coupleContainer = document.createElement('div');
        coupleContainer.className = 'couple-container';

        // Create husband/main person group
        const personGroup = document.createElement('div');
        personGroup.className = 'person-group';

        // Determine avatar class based on gender and relation
        let avatarClass = 'avatar';
        if (node.relation === '老屋' || node.relation === '二屋' || node.relation === '三屋' || node.relation === '结义老四') {
            avatarClass += ' avatar-founder';
        } else if (node.gender === '女') {
            avatarClass += ' avatar-female';
        } else {
            avatarClass += ' avatar-member';
        }

        // Create avatar
        const avatar = document.createElement('div');
        avatar.className = avatarClass;

        const avatarText = document.createElement('span');
        avatarText.className = 'avatar-text';
        avatarText.textContent = node.name.slice(-1);
        avatar.appendChild(avatarText);

        // Create label
        const label = document.createElement('div');
        label.className = 'node-label';

        const nameText = document.createElement('span');
        nameText.className = 'name-text';
        nameText.textContent = node.name;
        label.appendChild(nameText);

        // Assemble person group
        personGroup.appendChild(avatar);
        personGroup.appendChild(label);

        // Add click handler for main person
        personGroup.addEventListener('click', (e) => {
            e.stopPropagation();
            if (onNodeClick) {
                onNodeClick(node);
            }
        });

        coupleContainer.appendChild(personGroup);

        // Create wife node if exists
        if (node.wife) {
            const wifeGroup = document.createElement('div');
            wifeGroup.className = 'person-group wife-group';

            // Create wife avatar (purple/violet color)
            const wifeAvatar = document.createElement('div');
            wifeAvatar.className = 'avatar avatar-wife';

            const wifeAvatarText = document.createElement('span');
            wifeAvatarText.className = 'avatar-text';
            wifeAvatarText.textContent = node.wife.name.slice(-1);
            wifeAvatar.appendChild(wifeAvatarText);

            // Create wife label
            const wifeLabel = document.createElement('div');
            wifeLabel.className = 'node-label';

            const wifeNameText = document.createElement('span');
            wifeNameText.className = 'name-text';
            wifeNameText.textContent = node.wife.name;
            wifeLabel.appendChild(wifeNameText);

            // Assemble wife group
            wifeGroup.appendChild(wifeAvatar);
            wifeGroup.appendChild(wifeLabel);

            // Add click handler for wife
            wifeGroup.addEventListener('click', (e) => {
                e.stopPropagation();
                if (onNodeClick) {
                    // Create a node-like object for wife
                    const wifeNode = {
                        ...node.wife,
                        id: node.id + '_wife',
                        gender: '女',
                        relation: '配偶'
                    };
                    onNodeClick(wifeNode);
                }
            });

            coupleContainer.appendChild(wifeGroup);
        }

        // Assemble node content
        nodeContent.appendChild(coupleContainer);

        container.appendChild(nodeContent);

        // Add children if any
        if (node.children && node.children.length > 0) {
            // Add connecting line from parent
            const lineDown = document.createElement('div');
            lineDown.className = 'line-down';
            nodeContent.appendChild(lineDown);

            // Create children container
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'children-container';

            node.children.forEach(child => {
                const childWrapper = document.createElement('div');
                childWrapper.className = 'child-wrapper';

                // Add connecting line to child
                const lineUp = document.createElement('div');
                lineUp.className = 'line-up';
                childWrapper.appendChild(lineUp);

                // Render child node
                const childNode = this.renderNode(child, onNodeClick);
                childWrapper.appendChild(childNode);
                childrenContainer.appendChild(childWrapper);
            });

            container.appendChild(childrenContainer);
        }

        return container;
    },

    /**
     * Render full tree into container
     * @param {Array} roots - Array of root nodes
     * @param {HTMLElement} container - Container element
     * @param {Function} onNodeClick - Click callback
     */
    renderTree(roots, container, onNodeClick) {
        // Clear container
        container.innerHTML = '';

        // Render each root tree
        roots.forEach(root => {
            const treeElement = this.renderNode(root, onNodeClick);
            container.appendChild(treeElement);
        });
    },

    /**
     * Find node by ID in tree
     * @param {Array} nodes - Array of nodes to search
     * @param {string} id - Node ID to find
     * @returns {Object|null} Found node or null
     */
    findNodeById(nodes, id) {
        for (const node of nodes) {
            if (node.id === id) {
                return node;
            }
            if (node.children && node.children.length > 0) {
                const found = this.findNodeById(node.children, id);
                if (found) return found;
            }
        }
        return null;
    },

    /**
     * Find node by name in tree
     * @param {Array} nodes - Array of nodes to search
     * @param {string} name - Name to search for
     * @returns {Object|null} Found node or null
     */
    findNodeByName(nodes, name) {
        for (const node of nodes) {
            if (node.name === name) {
                return node;
            }
            if (node.wife && node.wife.name === name) {
                return node;
            }
            if (node.children && node.children.length > 0) {
                const found = this.findNodeByName(node.children, name);
                if (found) return found;
            }
        }
        return null;
    },

    /**
     * Highlight a node in the tree
     * @param {string} nodeId - Node ID to highlight
     */
    highlightNode(nodeId) {
        // Remove previous highlights
        document.querySelectorAll('.highlighted').forEach(el => {
            el.classList.remove('highlighted');
        });

        // Find and highlight the node
        const nodeElement = document.querySelector(`[data-id="${nodeId}"]`);
        if (nodeElement) {
            nodeElement.classList.add('highlighted');

            // Scroll node into view
            nodeElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            });
        }
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.TreeRenderer = TreeRenderer;
}
