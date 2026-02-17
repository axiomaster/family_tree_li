Component({
    properties: {
        node: {
            type: Object,
            value: null
        },
        targetId: {
            type: String,
            value: '',
            observer: function (newVal) {
                if (this.data.node && newVal && this.data.node.id === newVal) {
                    this.measureAndNotify();
                }
            }
        }
    },

    lifetimes: {
        ready() {
            // Check if this is the target node
            if (this.data.node && this.data.targetId && this.data.node.id === this.data.targetId) {
                // Wait for layout
                setTimeout(() => {
                    this.measureAndNotify();
                }, 500);
            }
        }
    },

    methods: {
        onTap(e) {
            const { node } = this.data;
            if (node) {
                this.triggerEvent('nodeTap', { node }, { bubbles: true, composed: true });
            }
        },

        onWifeTap(e) {
            const { node } = this.data;
            if (node && node.wife) {
                // Construct a node-like object for the wife
                const wifeNode = {
                    ...node.wife,
                    gender: '女',
                    relation: '配偶', // Or 'wife'
                    id: node.id + '_wife' // Virtual ID
                };
                this.triggerEvent('nodeTap', { node: wifeNode }, { bubbles: true, composed: true });
            }
        },

        measureAndNotify() {
            const query = wx.createSelectorQuery().in(this);
            query.select('.node-content').boundingClientRect(rect => {
                if (rect) {
                    console.log('[TreeNode] Found target:', this.data.node.name, rect);
                    this.triggerEvent('foundTarget', rect, { bubbles: true, composed: true });
                }
            }).exec();
        },

        // Handle bubble up from children
        onFoundTarget(e) {
            this.triggerEvent('foundTarget', e.detail, { bubbles: true, composed: true });
        }
    },

    // Enable component to recursively use itself
    options: {
        styleIsolation: 'shared'
    }
});
