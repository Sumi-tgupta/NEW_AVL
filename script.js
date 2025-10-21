// AVL Tree Visualizer - Enhanced Vanilla JavaScript Implementation

class AVLTree {
    constructor() {
        this.root = null;
        this.operationLog = [];
    }

    getHeight(node) {
        return node ? node.height : 0;
    }

    updateHeight(node) {
        node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
    }

    getBalance(node) {
        return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }

    getDepth(node, target, depth = 0) {
        if (!node) return -1;
        if (node.value === target) return depth;
        
        if (target < node.value) {
            return this.getDepth(node.left, target, depth + 1);
        } else {
            return this.getDepth(node.right, target, depth + 1);
        }
    }

    getSubtreeSize(node) {
        if (!node) return 0;
        return 1 + this.getSubtreeSize(node.left) + this.getSubtreeSize(node.right);
    }

    getMinValue(node) {
        if (!node) return null;
        while (node.left) {
            node = node.left;
        }
        return node.value;
    }

    getMaxValue(node) {
        if (!node) return null;
        while (node.right) {
            node = node.right;
        }
        return node.value;
    }

    findParent(node, target, parent = null) {
        if (!node) return null;
        if (node.value === target) return parent;
        
        if (target < node.value) {
            return this.findParent(node.left, target, node);
        } else {
            return this.findParent(node.right, target, node);
        }
    }

    getNodePosition(node, target, path = '') {
        if (!node) return '';
        if (node.value === target) return path || 'root';
        
        if (target < node.value) {
            return this.getNodePosition(node.left, target, path ? path + '-L' : 'L');
        } else {
            return this.getNodePosition(node.right, target, path ? path + '-R' : 'R');
        }
    }

    createNode(value) {
        return { value, left: null, right: null, height: 1 };
    }

    getInsertionSteps(value, path) {
        const steps = [
            `Step 1: Start at root node`,
            ...path.map((node, index) => 
                `Step ${index + 2}: Compare ${value} with ${node} → ${value < node ? 'Go Left' : 'Go Right'}`
            ),
            `Step ${path.length + 2}: Insert ${value} at leaf position`,
            `Step ${path.length + 3}: Update heights along insertion path`,
            `Step ${path.length + 4}: Check balance factors and rotate if needed`
        ];
        return steps;
    }

    getDeletionSteps(value, path) {
        const steps = [
            `Step 1: Start at root node to find ${value}`,
            ...path.map((node, index) => 
                `Step ${index + 2}: Compare ${value} with ${node} → ${value < node ? 'Go Left' : 'Go Right'}`
            ),
            `Step ${path.length + 2}: Found node ${value} to delete`,
            `Step ${path.length + 3}: Determine deletion case (0, 1, or 2 children)`,
            `Step ${path.length + 4}: Perform deletion and restructuring`,
            `Step ${path.length + 5}: Update heights and rebalance if needed`
        ];
        return steps;
    }

    logOperation(action, description, details = {}, type = 'info') {
        this.operationLog.push({
            id: Math.random().toString(36).substr(2, 9),
            action,
            description,
            details,
            timestamp: new Date(),
            type
        });
    }

    rotateRight(y) {
        const x = y.left;
        const T2 = x.right;

        // Perform rotation
        x.right = y;
        y.left = T2;

        // Update heights
        this.updateHeight(y);
        this.updateHeight(x);

        this.logOperation('Right Rotation', `Rotated node ${y.value} to become right child of ${x.value}`, {
            type: 'rotation',
            rotationType: 'right',
            pivot: y.value,
            newRoot: x.value,
            before: `Tree was unbalanced at node ${y.value}`,
            after: `Node ${x.value} is now the root of this subtree`,
            algorithm: `LL Case Detection:\nBalance Factor = ${this.getBalance(y)} > 1\nSolution: Single right rotation\n1. Make left child (x) the new root\n2. Make current node (y) the right child of x\n3. Move x's right child to y's left`,
            complexity: 'O(1)'
        }, 'warning');

        return x;
    }

    rotateLeft(x) {
        const y = x.right;
        const T2 = y.left;

        // Perform rotation
        y.left = x;
        x.right = T2;

        // Update heights
        this.updateHeight(x);
        this.updateHeight(y);

        this.logOperation('Left Rotation', `Rotated node ${x.value} to become left child of ${y.value}`, {
            type: 'rotation',
            rotationType: 'left',
            pivot: x.value,
            newRoot: y.value,
            before: `Tree was unbalanced at node ${x.value}`,
            after: `Node ${y.value} is now the root of this subtree`,
            algorithm: `RR Case Detection:\nBalance Factor = ${this.getBalance(x)} < -1\nSolution: Single left rotation\n1. Make right child (y) the new root\n2. Make current node (x) the left child of y\n3. Move y's left child to x's right`,
            complexity: 'O(1)'
        }, 'warning');

        return y;
    }

    balanceNode(node) {
        this.updateHeight(node);
        const balance = this.getBalance(node);

        // Left Left Case
        if (balance > 1 && this.getBalance(node.left) >= 0) {
            this.logOperation('LL Case', `Left-Left imbalance at node ${node.value}`, {
                type: 'balance',
                caseType: 'LL',
                node: node.value,
                balanceFactor: balance,
                solution: 'Single right rotation required',
                algorithm: `Balance Factor > 1 and left child balance >= 0\nThis is a Left-Left case requiring right rotation`,
                complexity: 'O(1)'
            }, 'warning');
            return this.rotateRight(node);
        }

        // Right Right Case
        if (balance < -1 && this.getBalance(node.right) <= 0) {
            this.logOperation('RR Case', `Right-Right imbalance at node ${node.value}`, {
                type: 'balance',
                caseType: 'RR',
                node: node.value,
                balanceFactor: balance,
                solution: 'Single left rotation required',
                algorithm: `Balance Factor < -1 and right child balance <= 0\nThis is a Right-Right case requiring left rotation`,
                complexity: 'O(1)'
            }, 'warning');
            return this.rotateLeft(node);
        }

        // Left Right Case
        if (balance > 1 && this.getBalance(node.left) < 0) {
            this.logOperation('LR Case', `Left-Right imbalance at node ${node.value}`, {
                type: 'balance',
                caseType: 'LR',
                node: node.value,
                balanceFactor: balance,
                solution: 'Left rotation on left child, then right rotation on node',
                algorithm: `Balance Factor > 1 and left child balance < 0\nThis is a Left-Right case requiring:\n1. Left rotation on left child\n2. Right rotation on current node`,
                complexity: 'O(1)'
            }, 'warning');
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }

        // Right Left Case
        if (balance < -1 && this.getBalance(node.right) > 0) {
            this.logOperation('RL Case', `Right-Left imbalance at node ${node.value}`, {
                type: 'balance',
                caseType: 'RL',
                node: node.value,
                balanceFactor: balance,
                solution: 'Right rotation on right child, then left rotation on node',
                algorithm: `Balance Factor < -1 and right child balance > 0\nThis is a Right-Left case requiring:\n1. Right rotation on right child\n2. Left rotation on current node`,
                complexity: 'O(1)'
            }, 'warning');
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node;
    }

    insert(node, value, path = []) {
        if (!node) {
            this.logOperation('Insert', `Inserted new node with value ${value}`, {
                type: 'insert',
                value: value,
                position: 'leaf',
                algorithm: this.getInsertionSteps(value, path).join('\n'),
                complexity: 'O(log n)',
                steps: this.getInsertionSteps(value, path)
            }, 'success');
            return { value, left: null, right: null, height: 1 };
        }

        const newPath = [...path, node.value];

        if (value < node.value) {
            this.logOperation('Insert Navigation', `Going left from node ${node.value} to insert ${value}`, {
                type: 'navigation',
                direction: 'left',
                from: node.value,
                target: value,
                algorithm: `Value ${value} < ${node.value}\nTraversing to left subtree`,
                complexity: 'O(1)'
            }, 'info');
            node.left = this.insert(node.left, value, newPath);
        } else if (value > node.value) {
            this.logOperation('Insert Navigation', `Going right from node ${node.value} to insert ${value}`, {
                type: 'navigation',
                direction: 'right',
                from: node.value,
                target: value,
                algorithm: `Value ${value} > ${node.value}\nTraversing to right subtree`,
                complexity: 'O(1)'
            }, 'info');
            node.right = this.insert(node.right, value, newPath);
        } else {
            this.logOperation('Duplicate', `Value ${value} already exists in tree`, {
                type: 'duplicate',
                value: value,
                algorithm: `Duplicate values are not allowed in BST\nIgnoring insertion of ${value}`,
                complexity: 'O(log n)'
            }, 'warning');
            return node;
        }

        return this.balanceNode(node);
    }

    findMin(node) {
        while (node.left) {
            node = node.left;
        }
        return node;
    }

    deleteNode(node, value, path = []) {
        if (!node) {
            this.logOperation('Delete Failed', `Value ${value} not found in tree`, {
                type: 'delete',
                value: value,
                success: false,
                algorithm: `Reached null node - value ${value} doesn't exist in tree`,
                complexity: 'O(log n)'
            }, 'error');
            return null;
        }

        const newPath = [...path, node.value];

        if (value < node.value) {
            this.logOperation('Delete Navigation', `Going left from node ${node.value} to delete ${value}`, {
                type: 'navigation',
                direction: 'left',
                from: node.value,
                target: value,
                algorithm: `Value ${value} < ${node.value}\nTraversing to left subtree for deletion`,
                complexity: 'O(1)'
            }, 'info');
            node.left = this.deleteNode(node.left, value, newPath);
        } else if (value > node.value) {
            this.logOperation('Delete Navigation', `Going right from node ${node.value} to delete ${value}`, {
                type: 'navigation',
                direction: 'right',
                from: node.value,
                target: value,
                algorithm: `Value ${value} > ${node.value}\nTraversing to right subtree for deletion`,
                complexity: 'O(1)'
            }, 'info');
            node.right = this.deleteNode(node.right, value, newPath);
        } else {
            // Node to be deleted found
            this.logOperation('Delete Found', `Found node ${value} to delete`, {
                type: 'delete',
                value: value,
                success: true,
                algorithm: `Found target node ${value}\nDetermining deletion case...`,
                complexity: 'O(log n)'
            }, 'info');

            if (!node.left) {
                this.logOperation('Delete Case 1', `Node ${value} has no left child`, {
                    type: 'delete',
                    case: 'no-left',
                    value: value,
                    algorithm: `Case 1: Node has no left child\nReplace node with its right child\nRight child might be null`,
                    complexity: 'O(1)'
                }, 'info');
                return node.right;
            }
            if (!node.right) {
                this.logOperation('Delete Case 2', `Node ${value} has no right child`, {
                    type: 'delete',
                    case: 'no-right',
                    value: value,
                    algorithm: `Case 2: Node has no right child\nReplace node with its left child`,
                    complexity: 'O(1)'
                }, 'info');
                return node.left;
            }

            // Node with two children
            const temp = this.findMin(node.right);
            this.logOperation('Delete Case 3', `Node ${value} has two children, replacing with inorder successor ${temp.value}`, {
                type: 'delete',
                case: 'two-children',
                value: value,
                replacement: temp.value,
                algorithm: `Case 3: Node has two children\n1. Find inorder successor (minimum in right subtree)\n2. Replace node value with successor value\n3. Delete the successor node\n4. Balance the tree`,
                complexity: 'O(log n)'
            }, 'info');
            node.value = temp.value;
            node.right = this.deleteNode(node.right, temp.value, newPath);
        }

        return node ? this.balanceNode(node) : null;
    }

    search(node, value, path = []) {
        if (!node) {
            this.logOperation('Search Failed', `Value ${value} not found in tree`, {
                type: 'search',
                value: value,
                found: false,
                algorithm: `Reached null node - value ${value} doesn't exist in tree\nSearch path exhausted`,
                complexity: 'O(log n)'
            }, 'error');
            return false;
        }

        const currentPath = [...path, node.value];

        if (value === node.value) {
            this.logOperation('Search Success', `Found value ${value} in tree`, {
                type: 'search',
                value: value,
                found: true,
                algorithm: `Found target node with value ${value}\nSearch successful!`,
                complexity: 'O(log n)'
            }, 'success');
            return true;
        }

        if (value < node.value) {
            this.logOperation('Search Navigation', `Going left from node ${node.value} searching for ${value}`, {
                type: 'navigation',
                direction: 'left',
                from: node.value,
                target: value,
                algorithm: `Value ${value} < ${node.value}\nTraversing to left subtree`,
                complexity: 'O(1)'
            }, 'info');
            return this.search(node.left, value, currentPath);
        } else {
            this.logOperation('Search Navigation', `Going right from node ${node.value} searching for ${value}`, {
                type: 'navigation',
                direction: 'right',
                from: node.value,
                target: value,
                algorithm: `Value ${value} > ${node.value}\nTraversing to right subtree`,
                complexity: 'O(1)'
            }, 'info');
            return this.search(node.right, value, currentPath);
        }
    }

    inOrderTraversal(node, result = []) {
        if (!node) return result;
        
        this.inOrderTraversal(node.left, result);
        result.push(node.value);
        this.inOrderTraversal(node.right, result);
        
        return result;
    }

    preOrderTraversal(node, result = []) {
        if (!node) return result;
        
        result.push(node.value);
        this.preOrderTraversal(node.left, result);
        this.preOrderTraversal(node.right, result);
        
        return result;
    }

    postOrderTraversal(node, result = []) {
        if (!node) return result;
        
        this.postOrderTraversal(node.left, result);
        this.postOrderTraversal(node.right, result);
        result.push(node.value);
        
        return result;
    }

    clearLog() {
        this.operationLog = [];
    }
}

// Traversal Animator Class
class TraversalAnimator {
    constructor(treeUI) {
        this.treeUI = treeUI;
        this.isRunning = false;
        this.isPaused = false;
        this.currentStep = 0;
        this.traversalSteps = [];
        this.animationSpeed = 800;
        this.currentTraversal = null;
        this.timeoutId = null;
    }

    generateTraversalSteps(type) {
        const steps = [];
        const visited = new Set();
        
        const generateSteps = (node, action = 'visit') => {
            if (!node) return;
            
            switch (type) {
                case 'in-order':
                    generateSteps(node.left, 'traverse');
                    steps.push({
                        action: 'visit',
                        node: node.value,
                        description: `Visiting node ${node.value}`,
                        algorithm: `In-order: Left -> Root -> Right\nCurrent step: Visiting root (${node.value})`
                    });
                    generateSteps(node.right, 'traverse');
                    break;
                    
                case 'pre-order':
                    steps.push({
                        action: 'visit',
                        node: node.value,
                        description: `Visiting node ${node.value}`,
                        algorithm: `Pre-order: Root -> Left -> Right\nCurrent step: Visiting root (${node.value})`
                    });
                    generateSteps(node.left, 'traverse');
                    generateSteps(node.right, 'traverse');
                    break;
                    
                case 'post-order':
                    generateSteps(node.left, 'traverse');
                    generateSteps(node.right, 'traverse');
                    steps.push({
                        action: 'visit',
                        node: node.value,
                        description: `Visiting node ${node.value}`,
                        algorithm: `Post-order: Left -> Right -> Root\nCurrent step: Visiting root (${node.value})`
                    });
                    break;
            }
        };
        
        generateSteps(this.treeUI.tree.root);
        return steps;
    }

    start(type) {
        if (this.isRunning) {
            this.stop();
        }
        
        this.currentTraversal = type;
        this.traversalSteps = this.generateTraversalSteps(type);
        this.currentStep = 0;
        this.isRunning = true;
        this.isPaused = false;
        
        document.getElementById('traversalPlayback').style.display = 'block';
        this.updateProgress();
        this.runStep();
    }

    runStep() {
        if (!this.isRunning || this.isPaused || this.currentStep >= this.traversalSteps.length) {
            if (this.currentStep >= this.traversalSteps.length) {
                this.stop();
            }
            return;
        }
        
        const step = this.traversalSteps[this.currentStep];
        this.treeUI.highlightedNode = step.action === 'visit' ? step.node : null;
        this.treeUI.render();
        
        this.treeUI.tree.logOperation(
            `${this.currentTraversal.charAt(0).toUpperCase() + this.currentTraversal.slice(1)} Traversal`,
            step.description,
            {
                type: 'traversal-step',
                traversalType: this.currentTraversal,
                algorithm: step.algorithm,
                step: this.currentStep + 1,
                complexity: 'O(n)'
            },
            'info'
        );
        
        this.treeUI.displayLogs();
        this.updateProgress();
        this.currentStep++;
        
        this.timeoutId = setTimeout(() => this.runStep(), this.animationSpeed);
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        if (this.isPaused && this.isRunning) {
            this.isPaused = false;
            this.runStep();
        }
    }

    step() {
        if (!this.isRunning) {
            this.start(this.currentTraversal || 'in-order');
        } else if (!this.isPaused) {
            this.pause();
        }
        this.runStep();
    }

    stop() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentStep = 0;
        this.traversalSteps = [];
        this.treeUI.highlightedNode = null;
        this.treeUI.render();
        document.getElementById('traversalPlayback').style.display = 'none';
        clearTimeout(this.timeoutId);
        this.updateProgress();
    }

    setSpeed(speed) {
        this.animationSpeed = speed;
    }

    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const currentStepDisplay = document.getElementById('currentStep');
        const traversalResult = document.getElementById('traversalResult');
        
        const progress = this.traversalSteps.length ? 
            (this.currentStep / this.traversalSteps.length) * 100 : 0;
            
        progressFill.style.width = `${progress}%`;
        currentStepDisplay.textContent = `Step ${this.currentStep} of ${this.traversalSteps.length}`;
        
        const visitedNodes = this.traversalSteps
            .slice(0, this.currentStep)
            .filter(step => step.action === 'visit')
            .map(step => step.node);
            
        traversalResult.textContent = `Visited: ${visitedNodes.join(' → ') || 'None'}`;
    }
}

// AVLTreeUI Class
class AVLTreeUI {
    constructor() {
        this.tree = new AVLTree();
        this.traversalAnimator = new TraversalAnimator(this);
        this.zoom = 1;
        this.pan = { x: 0, y: 0 };
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.highlightedNode = null;
        
        this.initializeNavigation();
        this.initializeControls();
        this.setupThemeToggle();
        this.setupZoomControls();
        this.setupModal();
        this.render();
        this.displayLogs();
    }

    initializeControls() {
        // Insert
        document.getElementById('insertBtn').addEventListener('click', () => {
            const input = document.getElementById('inputValue');
            const value = parseInt(input.value);
            if (!isNaN(value)) {
                this.tree.root = this.tree.insert(this.tree.root, value);
                this.render();
                this.displayLogs();
                input.value = '';
            }
        });

        // Delete
        document.getElementById('deleteBtn').addEventListener('click', () => {
            const input = document.getElementById('inputValue');
            const value = parseInt(input.value);
            if (!isNaN(value)) {
                this.tree.root = this.tree.deleteNode(this.tree.root, value);
                this.render();
                this.displayLogs();
                input.value = '';
            }
        });

        // Search
        document.getElementById('searchBtn').addEventListener('click', () => {
            const input = document.getElementById('searchValue');
            const value = parseInt(input.value);
            if (!isNaN(value)) {
                this.tree.search(this.tree.root, value);
                this.displayLogs();
                input.value = '';
            }
        });

        // Generate Random
        document.getElementById('randomBtn').addEventListener('click', () => {
            const count = Math.floor(Math.random() * 10) + 5;
            this.tree.root = null;
            this.tree.clearLog();
            for (let i = 0; i < count; i++) {
                const value = Math.floor(Math.random() * 100);
                this.tree.root = this.tree.insert(this.tree.root, value);
            }
            this.tree.logOperation('Generate Random', `Generated tree with ${count} random nodes`, {
                type: 'generate',
                count: count,
                algorithm: `Generated ${count} random values and inserted them`,
                complexity: 'O(n log n)'
            }, 'info');
            this.render();
            this.displayLogs();
        });

        // Reset
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.tree.root = null;
            this.tree.clearLog();
            this.traversalAnimator.stop();
            this.tree.logOperation('Reset', 'Cleared all nodes from the tree', {
                type: 'reset',
                algorithm: 'Set root to null and clear operation log',
                complexity: 'O(1)'
            }, 'error');
            this.render();
            this.displayLogs();
        });

        // Traversal Visualization Controls
        document.getElementById('inOrderVisualBtn').addEventListener('click', () => {
            this.traversalAnimator.start('in-order');
        });

        document.getElementById('preOrderVisualBtn').addEventListener('click', () => {
            this.traversalAnimator.start('pre-order');
        });

        document.getElementById('postOrderVisualBtn').addEventListener('click', () => {
            this.traversalAnimator.start('post-order');
        });

        // Playback controls
        document.getElementById('playBtn').addEventListener('click', () => {
            this.traversalAnimator.resume();
        });

        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.traversalAnimator.pause();
        });

        document.getElementById('stepBtn').addEventListener('click', () => {
            this.traversalAnimator.step();
        });

        document.getElementById('stopBtn').addEventListener('click', () => {
            this.traversalAnimator.stop();
        });

        // Speed control
        const speedSlider = document.getElementById('speedSlider');
        const speedValue = document.getElementById('speedValue');
        
        speedSlider.addEventListener('input', (e) => {
            const speed = parseInt(e.target.value);
            speedValue.textContent = `${speed}ms`;
            this.traversalAnimator.setSpeed(speed);
        });
    }

    setupModal() {
        const modal = document.getElementById('nodeModal');
        const closeBtn = document.getElementById('closeModal');

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }

    showNodeProperties(nodeValue) {
        const node = this.findNode(this.tree.root, nodeValue);
        if (!node) return;

        const modal = document.getElementById('nodeModal');
        
        // Basic Information
        document.getElementById('nodeValue').textContent = node.value;
        document.getElementById('nodeHeight').textContent = node.height;
        document.getElementById('nodeDepth').textContent = this.tree.getDepth(this.tree.root, node.value);
        document.getElementById('nodeBalance').textContent = this.tree.getBalance(node);

        // Subtree Information
        document.getElementById('subtreeSize').textContent = this.tree.getSubtreeSize(node);
        document.getElementById('leftChild').textContent = node.left ? node.left.value : 'None';
        document.getElementById('rightChild').textContent = node.right ? node.right.value : 'None';
        
        const parent = this.tree.findParent(this.tree.root, node.value);
        document.getElementById('parentNode').textContent = parent ? parent.value : 'None';

        // Subtree Range
        document.getElementById('minValue').textContent = this.tree.getMinValue(node) || 'N/A';
        document.getElementById('maxValue').textContent = this.tree.getMaxValue(node) || 'N/A';

        // Position
        document.getElementById('isRoot').textContent = this.tree.root === node ? 'Yes' : 'No';
        document.getElementById('isLeaf').textContent = (!node.left && !node.right) ? 'Yes' : 'No';
        document.getElementById('nodePosition').textContent = this.tree.getNodePosition(this.tree.root, node.value);

        modal.classList.add('show');
    }

    findNode(node, value) {
        if (!node) return null;
        if (node.value === value) return node;
        
        if (value < node.value) {
            return this.findNode(node.left, value);
        } else {
            return this.findNode(node.right, value);
        }
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const savedTheme = localStorage.getItem('theme') || 'light';
        
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    setupZoomControls() {
        const container = document.getElementById('treeContainer');
        
        // Zoom buttons
        document.getElementById('zoomInBtn').addEventListener('click', () => {
            this.zoom = Math.min(this.zoom + 0.2, 3);
            this.updateTransform();
        });

        document.getElementById('zoomOutBtn').addEventListener('click', () => {
            this.zoom = Math.max(this.zoom - 0.2, 0.3);
            this.updateTransform();
        });

        document.getElementById('resetViewBtn').addEventListener('click', () => {
            this.zoom = 1;
            this.pan = { x: 0, y: 0 };
            this.updateTransform();
        });

        // Pan functionality
        container.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.dragStart = { x: e.clientX - this.pan.x, y: e.clientY - this.pan.y };
            container.classList.add('dragging');
        });

        container.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.pan = {
                    x: e.clientX - this.dragStart.x,
                    y: e.clientY - this.dragStart.y
                };
                this.updateTransform();
            }
        });

        container.addEventListener('mouseup', () => {
            this.isDragging = false;
            container.classList.remove('dragging');
        });

        container.addEventListener('mouseleave', () => {
            this.isDragging = false;
            container.classList.remove('dragging');
        });

        // Mouse wheel zoom
        container.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            this.zoom = Math.max(0.3, Math.min(3, this.zoom + delta));
            this.updateTransform();
        });
    }

    updateTransform() {
        const svg = document.querySelector('#treeSvg');
        if (svg) {
            svg.style.transform = `translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.zoom})`;
        }
    }

    render() {
        const container = document.getElementById('treeContainer');
        
        if (!this.tree.root) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="tree-icon">🌳</div>
                    <p>Your AVL tree will appear here</p>
                    <p>Insert some nodes to get started!</p>
                </div>
            `;
            return;
        }

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('id', 'treeSvg');
        svg.setAttribute('viewBox', '0 0 800 500');
        
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', 'translate(400, 50)');
        
        this.renderNode(g, this.tree.root, 0, 0, 0);
        svg.appendChild(g);
        container.innerHTML = '';
        container.appendChild(svg);

        this.updateTransform();
    }

    renderNode(svgGroup, node, x, y, level) {
        if (!node) return;

        const horizontalSpacing = 150 / Math.pow(1.5, level);
        const verticalSpacing = 80;

        // Draw edges first (behind nodes)
        if (node.left) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x);
            line.setAttribute('y1', y);
            line.setAttribute('x2', x - horizontalSpacing);
            line.setAttribute('y2', y + verticalSpacing);
            line.setAttribute('class', 'tree-edge');
            svgGroup.appendChild(line);
            
            this.renderNode(svgGroup, node.left, x - horizontalSpacing, y + verticalSpacing, level + 1);
        }

        if (node.right) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x);
            line.setAttribute('y1', y);
            line.setAttribute('x2', x + horizontalSpacing);
            line.setAttribute('y2', y + verticalSpacing);
            line.setAttribute('class', 'tree-edge');
            svgGroup.appendChild(line);
            
            this.renderNode(svgGroup, node.right, x + horizontalSpacing, y + verticalSpacing, level + 1);
        }

        // Draw node
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', `tree-node clickable ${this.highlightedNode === node.value ? 'highlighted' : ''}`);
        g.setAttribute('transform', `translate(${x}, ${y})`);
        g.setAttribute('data-node-value', node.value);
        g.style.cursor = 'pointer';

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', '25');
        circle.setAttribute('class', 'node-circle');
        if (this.highlightedNode === node.value) {
            circle.setAttribute('fill', '#ef4444');
        }

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('class', 'node-text');
        text.textContent = node.value;

        const heightText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        heightText.setAttribute('y', '-35');
        heightText.setAttribute('class', 'node-height');
        heightText.textContent = `h=${node.height}`;

        const balanceText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        balanceText.setAttribute('y', '35');
        balanceText.setAttribute('class', 'node-balance');
        balanceText.textContent = `BF=${this.tree.getBalance(node)}`;

        g.appendChild(circle);
        g.appendChild(text);
        g.appendChild(heightText);
        g.appendChild(balanceText);
        svgGroup.appendChild(g);

        // Add click event listener
        g.addEventListener('click', () => {
            this.showNodeProperties(node.value);
        });

        // Add hover tooltip
        const tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        tooltip.setAttribute('x', '30');
        tooltip.setAttribute('y', '-20');
        tooltip.setAttribute('width', '200');
        tooltip.setAttribute('height', '100');
        const tooltipDiv = document.createElement('div');
        tooltipDiv.classList.add('tooltip');
        tooltipDiv.innerHTML = `
            Depth: ${this.tree.getDepth(this.tree.root, node.value)}<br>
            Height: ${node.height}<br>
            Balance: ${this.tree.getBalance(node)}
        `;
        tooltip.appendChild(tooltipDiv);
        g.appendChild(tooltip);
    }

    displayLogs() {
        const logContainer = document.getElementById('activityLog');
        const logs = this.tree.operationLog.slice(-50).reverse(); // Show last 50 logs, newest first

        if (logs.length === 0) {
            logContainer.innerHTML = `
                <div class="log-entry empty">
                    <span class="log-text">No activities yet</span>
                </div>
            `;
            return;
        }

        logContainer.innerHTML = logs.map(log => {
            const logClass = this.getLogClass(log.type);
            const time = log.timestamp.toLocaleTimeString();
            
            return `
                <div class="log-entry ${logClass}">
                    <div class="log-header">
                        <span class="log-action">${log.action}</span>
                        ${log.details.value ? `<span class="log-value">${log.details.value}</span>` : ''}
                    </div>
                    <div class="log-details">${log.description}</div>
                    ${log.details.algorithm ? `
                        <div class="log-algorithm">${log.details.algorithm}</div>
                    ` : ''}
                    ${log.details.complexity ? `
                        <div class="log-complexity">Complexity: <span>${log.details.complexity}</span></div>
                    ` : ''}
                    <div class="log-time">${time}</div>
                </div>
            `;
        }).join('');
    }

    getLogClass(type) {
        switch (type) {
            case 'insert': return 'success';
            case 'delete': return 'error';
            case 'search': return 'info';
            case 'rotation': return 'warning';
            case 'balance': return 'warning';
            case 'traversal': return 'info';
            case 'traversal-step': return 'info';
            case 'reset': return 'error';
            case 'duplicate': return 'warning';
            case 'generate': return 'info';
            case 'navigation': return 'info';
            default: return '';
        }
    }

    // Page navigation functionality
    initializeNavigation() {
        const visualizerTab = document.getElementById('visualizerTab');
        const learnTab = document.getElementById('learnTab');
        const visualizerPage = document.getElementById('visualizerPage');
        const learnPage = document.getElementById('learnPage');

        // Tab switching
        visualizerTab.addEventListener('click', () => {
            this.switchTab('visualizer');
        });

        learnTab.addEventListener('click', () => {
            this.switchTab('learn');
        });

        // Learn page navigation
        this.initializeLearnNavigation();
    }

    switchTab(tab) {
        const visualizerTab = document.getElementById('visualizerTab');
        const learnTab = document.getElementById('learnTab');
        const visualizerPage = document.getElementById('visualizerPage');
        const learnPage = document.getElementById('learnPage');

        if (tab === 'visualizer') {
            visualizerTab.classList.add('active');
            learnTab.classList.remove('active');
            visualizerPage.classList.add('active');
            learnPage.classList.remove('active');
        } else if (tab === 'learn') {
            visualizerTab.classList.remove('active');
            learnTab.classList.add('active');
            visualizerPage.classList.remove('active');
            learnPage.classList.add('active');
        }
    }

    initializeLearnNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.content-section');

        // Handle nav link clicks
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.showSection(targetId);
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Close mobile menu after clicking a link (if on mobile)
                if (window.innerWidth <= 1024) {
                    this.closeMobileMenu();
                }
            });
        });

        // Handle scroll spy
        window.addEventListener('scroll', () => {
            this.updateActiveSection();
        });

        // Initialize mobile menu functionality
        this.initializeMobileMenu();
    }

    initializeMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const learnSidebar = document.getElementById('learnSidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const menuIcon = document.getElementById('menuIcon');

        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const learnSidebar = document.getElementById('learnSidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const menuIcon = document.getElementById('menuIcon');

        if (learnSidebar.classList.contains('active')) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        const learnSidebar = document.getElementById('learnSidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const menuIcon = document.getElementById('menuIcon');

        learnSidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        mobileMenuToggle.classList.add('active');
        menuIcon.textContent = '✕';
    }

    closeMobileMenu() {
        const learnSidebar = document.getElementById('learnSidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const menuIcon = document.getElementById('menuIcon');

        learnSidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        menuIcon.textContent = '☰';
    }

    showSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    updateActiveSection() {
        const sections = document.querySelectorAll('.content-section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new AVLTreeUI();
});