// Modal module for Lee Family Tree (李门家谱)

const Modal = {
    elements: null,

    /**
     * Initialize modal elements
     */
    init() {
        this.elements = {
            mask: document.getElementById('modalMask'),
            content: document.querySelector('.modal-content'),
            avatar: document.getElementById('modalAvatar'),
            avatarText: document.getElementById('modalAvatarText'),
            name: document.getElementById('modalName'),
            relation: document.getElementById('modalRelation'),
            gender: document.getElementById('modalGender'),
            birth: document.getElementById('modalBirth'),
            death: document.getElementById('modalDeath'),
            bio: document.getElementById('modalBio'),
            closeBtn: document.getElementById('closeModal')
        };

        // Setup close handlers
        if (this.elements.mask) {
            this.elements.mask.addEventListener('click', (e) => {
                if (e.target === this.elements.mask) {
                    this.hide();
                }
            });
        }

        if (this.elements.closeBtn) {
            this.elements.closeBtn.addEventListener('click', () => {
                this.hide();
            });
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.mask.classList.contains('active')) {
                this.hide();
            }
        });
    },

    /**
     * Show modal with member data
     * @param {Object} node - Member node data
     */
    show(node) {
        if (!this.elements) {
            this.init();
        }

        // Update content
        this.updateContent(node);

        // Show modal
        this.elements.mask.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    /**
     * Hide modal
     */
    hide() {
        if (!this.elements) {
            this.init();
        }

        this.elements.mask.classList.remove('active');
        document.body.style.overflow = '';
    },

    /**
     * Update modal content with member data
     * @param {Object} node - Member node data
     */
    updateContent(node) {
        if (!this.elements) {
            this.init();
        }

        // Set avatar
        const avatarClass = this.getAvatarClass(node);
        this.elements.avatar.className = 'avatar ' + avatarClass;
        this.elements.avatarText.textContent = node.name.slice(-1);

        // Set name and relation
        this.elements.name.textContent = node.name;
        this.elements.relation.textContent = node.relation || '';

        // Set info
        this.elements.gender.textContent = node.gender || '未知';
        this.elements.birth.textContent = node.birth || '未知';
        this.elements.death.textContent = node.death || '健在';

        // Set bio
        this.elements.bio.textContent = node.bio || '暂无该成员的详细介绍资料。';
    },

    /**
     * Get avatar CSS class based on member data
     * @param {Object} node - Member node data
     * @returns {string} Avatar class
     */
    getAvatarClass(node) {
        if (node.relation === '老屋' || node.relation === '二屋' || node.relation === '三屋') {
            return 'avatar-founder';
        }
        if (node.gender === '女') {
            return 'avatar-female';
        }
        return 'avatar-member';
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.Modal = Modal;
}
