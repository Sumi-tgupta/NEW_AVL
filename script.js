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
            algorithm: `1. Store left child (x) of y\n2. Make right child of x (T2) as left child of y\n3. Make y as right child of x\n4. Update heights of y and x`
        });

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
            algorithm: `1. Store right child (y) of x\n2. Make left child of y (T2) as right child of x\n3. Make x as left child of y\n4. Update heights of x and y`
        });

        return y;
    }

    balanceNode(node) {
        this.updateHeight(node);
        const balance = this.getBalance(node);

        // Left Left Case
        if (balance > 1 && this.getBalance(node.left) >= 0) {
            this.logOperation('LL Case', `Left-Left imbalance detected at node ${node.value}`, {
                type: 'balance',
                caseType: 'LL',
                node: node.value,
                balanceFactor: balance,
                solution: 'Single right rotation required',
                algorithm: `Balance Factor > 1 and left child balance >= 0\nThis is a Left-Left case requiring right rotation`
            });
            return this.rotateRight(node);
        }

        // Right Right Case
        if (balance < -1 && this.getBalance(node.right) <= 0) {
            this.logOperation('RR Case', `Right-Right imbalance detected at node ${node.value}`, {
                type: 'balance',
                caseType: 'RR',
                node: node.value,
                balanceFactor: balance,
                solution: 'Single left rotation required',
                algorithm: `Balance Factor < -1 and right child balance <= 0\nThis is a Right-Right case requiring left rotation`
            });
            return this.rotateLeft(node);
        }

        // Left Right Case
        if (balance > 1 && this.getBalance(node.left) < 0) {
            this.logOperation('LR Case', `Left-Right imbalance detected at node ${node.value}`, {
                type: 'balance',
                caseType: 'LR',
                node: node.value,
                balanceFactor: balance,
                solution: 'Left rotation on left child, then right rotation on node',
                algorithm: `Balance Factor > 1 and left child balance < 0\nThis is a Left-Right case requiring:\n1. Left rotation on left child\n2. Right rotation on current node`
            });
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }

        // Right Left Case
        if (balance < -1 && this.getBalance(node.right) > 0) {
            this.logOperation('RL Case', `Right-Left imbalance detected at node ${node.value}`, {
                type: 'balance',
                caseType: 'RL',
                node: node.value,
                balanceFactor: balance,
                solution: 'Right rotation on right child, then left rotation on node',
                algorithm: `Balance Factor < -1 and right child balance > 0\nThis is a Right-Left case requiring:\n1. Right rotation on right child\n2. Left rotation on current node`
            });
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node;
    }

    insert(node, value) {
        if (!node) {
            this.logOperation('Insert', `Inserted new node with value ${value}`, {
                type: 'insert',
                value: value,
                position: 'leaf',
                algorithm: `1. Reached null position - perfect spot for new node\n2. Created new node with value ${value}\n3. Initial height set to 1\n4. Balance factor = 0 (no children)`
            });
            return { value, left: null, right: null, height: 1 };
        }

        if (value < node.value) {
            this.logOperation('Insert Navigation', `Going left from node ${node.value} to insert ${value}`, {
                type: 'navigation',
                direction: 'left',
                from: node.value,
                target: value,
                algorithm: `Value ${value} < ${node.value}\nTraversing to left subtree`
            });
            node.left = this.insert(node.left, value);
        } else if (value > node.value) {
            this.logOperation('Insert Navigation', `Going right from node ${node.value} to insert ${value}`, {
                type: 'navigation',
                direction: 'right',
                from: node.value,
                target: value,
                algorithm: `Value ${value} > ${node.value}\nTraversing to right subtree`
            });
            node.right = this.insert(node.right, value);
        } else {
            this.logOperation('Duplicate', `Value ${value} already exists in tree`, {
                type: 'duplicate',
                value: value,
                algorithm: `Duplicate values are not allowed in BST\nIgnoring insertion of ${value}`
            });
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

    deleteNode(node, value) {
        if (!node) {
            this.logOperation('Delete Failed', `Value ${value} not found in tree`, {
                type: 'delete',
                value: value,
                success: false,
                algorithm: `Reached null node - value ${value} doesn't exist in tree`
            });
            return null;
        }

        if (value < node.value) {
            this.logOperation('Delete Navigation', `Going left from node ${node.value} to delete ${value}`, {
                type: 'navigation',
                direction: 'left',
                from: node.value,
                target: value,
                algorithm: `Value ${value} < ${node.value}\nTraversing to left subtree for deletion`
            });
            node.left = this.deleteNode(node.left, value);
        } else if (value > node.value) {
            this.logOperation('Delete Navigation', `Going right from node ${node.value} to delete ${value}`, {
                type: 'navigation',
                direction: 'right',
                from: node.value,
                target: value,
                algorithm: `Value ${value} > ${node.value}\nTraversing to right subtree for deletion`
            });
            node.right = this.deleteNode(node.right, value);
        } else {
            // Node to be deleted found
            this.logOperation('Delete Found', `Found node ${value} to delete`, {
                type: 'delete',
                value: value,
                success: true,
                algorithm: `Found target node ${value}\nDetermining deletion case...`
            });

            if (!node.left) {
                this.logOperation('Delete Case 1', `Node ${value} has no left child`, {
                    type: 'delete',
                    case: 'no-left',
                    value: value,
                    algorithm: `Case 1: Node has no left child\nReplace node with its right child\nRight child might be null`
                });
                return node.right;
            }
            if (!node.right) {
                this.logOperation('Delete Case 2', `Node ${value} has no right child`, {
                    type: 'delete',
                    case: 'no-right',
                    value: value,
                    algorithm: `Case 2: Node has no right child\nReplace node with its left child`
                });
                return node.left;
            }

            // Node with two children
            const temp = this.findMin(node.right);
            this.logOperation('Delete Case 3', `Node ${value} has two children, replacing with inorder successor ${temp.value}`, {
                type: 'delete',
                case: 'two-children',
                value: value,
                replacement: temp.value,
                algorithm: `Case 3: Node has two children\n1. Find inorder successor (minimum in right subtree)\n2. Replace node value with successor value\n3. Delete the successor node\n4. Balance the tree`
            });
            node.value = temp.value;
            node.right = this.deleteNode(node.right, temp.value);
        }

        return node ? this.balanceNode(node) : null;
    }

    search(node, value) {
        if (!node) {
            this.logOperation('Search Failed', `Value ${value} not found in tree`, {
                type: 'search',
                value: value,
                found: false,
                algorithm: `Reached null node - value ${value} doesn't exist in tree\nSearch path exhausted`
            });
            return false;
        }

        if (value === node.value) {
            this.logOperation('Search Success', `Found value ${value} in tree`, {
                type: 'search',
                value: value,
                found: true,
                algorithm: `Found target node with value ${value}\nSearch successful!`
            });
            return true;
        }

        if (value < node.value) {
            this.logOperation('Search Navigation', `Going left from node ${node.value} searching for ${value}`, {
                type: 'navigation',
                direction: 'left',
                from: node.value,
                target: value,
                algorithm: `Value ${value} < ${node.value}\nTraversing to left subtree`
            });
            return this.search(node.left, value);
        } else {
            this.logOperation('Search Navigation', `Going right from node ${node.value} searching for ${value}`, {
                type: 'navigation',
                direction: 'right',
                from: node.value,
                target: value,
                algorithm: `Value ${value} > ${node.value}\nTraversing to right subtree`
            });
            return this.search(node.right, value);
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

    logOperation(action, description, details = {}) {
        this.operationLog.push({
            action,
            description,
            details,
            timestamp: new Date()
        });
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
        if (this.isRunning) return;
        
        this.currentTraversal = type;
        this.traversalSteps = this.generateTraversalSteps(type);
        this.currentStep = 0;
        this.isRunning = true;
        this.isPaused = false;
        
        // Show playback controls
        document.getElementById('traversalPlayback').style.display = 'block';
        
        // Clear previous highlights
        this.clearHighlights();
        
        // Log traversal start
        this.treeUI.tree.logOperation(`${type.charAt(0).toUpperCase() + type.slice(1)} Visualization Started`, 
            `Starting step-by-step ${type} traversal visualization`, {
                type: 'traversal',
                method: type,
                algorithm: `${type.charAt(0).toUpperCase() + type.slice(1)} Traversal:\n${this.getTraversalAlgorithm(type)}`
            });
        this.treeUI.displayLogs();
        
        this.animate();
    }

    getTraversalAlgorithm(type) {
        switch (type) {
            case 'in-order':
                return '1. Traverse left subtree\n2. Visit root node\n3. Traverse right subtree\nResult: Left -> Root -> Right (Sorted order)';
            case 'pre-order':
                return '1. Visit root node\n2. Traverse left subtree\n3. Traverse right subtree\nResult: Root -> Left -> Right (Useful for copying trees)';
            case 'post-order':
                return '1. Traverse left subtree\n2. Traverse right subtree\n3. Visit root node\nResult: Left -> Right -> Root (Useful for deleting trees)';
            default:
                return '';
        }
    }

    animate() {
        if (!this.isRunning || this.isPaused) return;
        
        if (this.currentStep >= this.traversalSteps.length) {
            this.complete();
            return;
        }
        
        const step = this.traversalSteps[this.currentStep];
        this.executeStep(step);
        this.updateProgress();
        
        this.currentStep++;
        this.timeoutId = setTimeout(() => this.animate(), this.animationSpeed);
    }

    executeStep(step) {
        // Clear previous current node highlight
        this.clearCurrentHighlight();
        
        // Highlight current node
        const nodeElement = document.querySelector(`[data-node-value="${step.node}"]`);
        if (nodeElement) {
            nodeElement.classList.add('current');
            
            // Add visiting animation
            setTimeout(() => {
                nodeElement.classList.add('visiting');
                setTimeout(() => {
                    nodeElement.classList.remove('visiting');
                    nodeElement.classList.add('visited');
                }, 500);
            }, 100);
        }
        
        // Update step info
        document.getElementById('currentStep').textContent = `Step ${this.currentStep + 1}: ${step.description}`;
        
        // Update result
        const visitedNodes = this.traversalSteps.slice(0, this.currentStep + 1).map(s => s.node);
        document.getElementById('traversalResult').textContent = `[${visitedNodes.join(', ')}]`;
        
        // Log step
        this.treeUI.tree.logOperation('Traversal Step', step.description, {
            type: 'traversal-step',
            step: this.currentStep + 1,
            node: step.node,
            result: visitedNodes,
            algorithm: step.algorithm
        });
        this.treeUI.displayLogs();
    }

    clearHighlights() {
        document.querySelectorAll('.tree-node').forEach(node => {
            node.classList.remove('current', 'visiting', 'visited');
        });
        document.querySelectorAll('.tree-edge').forEach(edge => {
            edge.classList.remove('traversal-path');
        });
    }

    clearCurrentHighlight() {
        document.querySelectorAll('.tree-node.current').forEach(node => {
            node.classList.remove('current');
        });
    }

    updateProgress() {
        const progress = ((this.currentStep + 1) / this.traversalSteps.length) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
    }

    pause() {
        this.isPaused = true;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    resume() {
        if (!this.isRunning || !this.isPaused) return;
        this.isPaused = false;
        this.animate();
    }

    step() {
        if (!this.isRunning) return;
        
        this.pause();
        if (this.currentStep < this.traversalSteps.length) {
            const step = this.traversalSteps[this.currentStep];
            this.executeStep(step);
            this.updateProgress();
            this.currentStep++;
        }
        
        if (this.currentStep >= this.traversalSteps.length) {
            this.complete();
        }
    }

    stop() {
        this.isRunning = false;
        this.isPaused = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.clearHighlights();
        document.getElementById('traversalPlayback').style.display = 'none';
        document.getElementById('currentStep').textContent = 'Step 0';
        document.getElementById('traversalResult').textContent = '';
        document.getElementById('progressFill').style.width = '0%';
        
        // Log completion
        if (this.currentTraversal) {
            const result = this.traversalSteps.map(s => s.node);
            this.treeUI.tree.logOperation('Traversal Stopped', `${this.currentTraversal} traversal stopped by user`, {
                type: 'traversal',
                method: this.currentTraversal,
                result: result,
                algorithm: `Traversal was stopped manually at step ${this.currentStep}`
            });
            this.treeUI.displayLogs();
        }
    }

    complete() {
        this.isRunning = false;
        
        // Show final result
        const result = this.traversalSteps.map(s => s.node);
        document.getElementById('currentStep').textContent = `Complete!`;
        document.getElementById('traversalResult').textContent = `Final: [${result.join(', ')}]`;
        
        // Log completion
        this.treeUI.tree.logOperation(`${this.currentTraversal.charAt(0).toUpperCase() + this.currentTraversal.slice(1)} Complete`, 
            `Traversal completed with result: [${result.join(', ')}]`, {
                type: 'traversal',
                method: this.currentTraversal,
                result: result,
                algorithm: `${this.currentTraversal.charAt(0).toUpperCase() + this.currentTraversal.slice(1)} traversal completed successfully!\nFinal result: [${result.join(', ')}]`
            });
        this.treeUI.displayLogs();
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            if (!this.isRunning) {
                document.getElementById('traversalPlayback').style.display = 'none';
            }
        }, 3000);
    }

    setSpeed(speed) {
        this.animationSpeed = speed;
    }
}

// UI Controller
class AVLTreeUI {
    constructor() {
        this.tree = new AVLTree();
        this.highlightedNode = null;
        this.selectedNode = null;
        this.traversalAnimator = new TraversalAnimator(this);
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupThemeToggle();
        this.setupModal();
        this.setupTraversalControls();
        this.initializeNavigation();
        this.render();
    }

    setupEventListeners() {
        // Insert button
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

        // Delete button
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

        // Search button
        document.getElementById('searchBtn').addEventListener('click', () => {
            const input = document.getElementById('searchValue');
            const value = parseInt(input.value);
            if (!isNaN(value)) {
                this.highlightedNode = null;
                const found = this.tree.search(this.tree.root, value);
                if (found) {
                    this.highlightedNode = value;
                    setTimeout(() => {
                        this.highlightedNode = null;
                        this.render();
                    }, 2000);
                }
                this.render();
                this.displayLogs();
                input.value = '';
            }
        });

        // Traversal buttons
        document.getElementById('inOrderBtn').addEventListener('click', () => {
            const result = this.tree.inOrderTraversal(this.tree.root);
            this.tree.logOperation('In-order Traversal', `Result: [${result.join(', ')}]`, {
                type: 'traversal',
                method: 'in-order',
                result: result,
                algorithm: `In-order Traversal Algorithm:\n1. Traverse left subtree\n2. Visit root node\n3. Traverse right subtree\nResult: Left -> Root -> Right`
            });
            this.displayLogs();
        });

        document.getElementById('preOrderBtn').addEventListener('click', () => {
            const result = this.tree.preOrderTraversal(this.tree.root);
            this.tree.logOperation('Pre-order Traversal', `Result: [${result.join(', ')}]`, {
                type: 'traversal',
                method: 'pre-order',
                result: result,
                algorithm: `Pre-order Traversal Algorithm:\n1. Visit root node\n2. Traverse left subtree\n3. Traverse right subtree\nResult: Root -> Left -> Right`
            });
            this.displayLogs();
        });

        document.getElementById('postOrderBtn').addEventListener('click', () => {
            const result = this.tree.postOrderTraversal(this.tree.root);
            this.tree.logOperation('Post-order Traversal', `Result: [${result.join(', ')}]`, {
                type: 'traversal',
                method: 'post-order',
                result: result,
                algorithm: `Post-order Traversal Algorithm:\n1. Traverse left subtree\n2. Traverse right subtree\n3. Visit root node\nResult: Left -> Right -> Root`
            });
            this.displayLogs();
        });

        // Operations buttons
        document.getElementById('randomBtn').addEventListener('click', () => {
            const values = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
            this.tree.logOperation('Generate Random', `Creating tree with values: [${values.join(', ')}]`, {
                type: 'generate',
                values: values,
                algorithm: `Random Tree Generation:\n1. Generated 10 random values (0-99)\n2. Inserting values one by one\n3. Tree will auto-balance after each insertion`
            });
            
            this.tree.root = null;
            values.forEach(value => {
                this.tree.root = this.tree.insert(this.tree.root, value);
            });
            this.render();
            this.displayLogs();
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            if (!this.tree.root) {
                this.tree.logOperation('Export Failed', 'Tree is empty', {
                    type: 'export',
                    success: false,
                    algorithm: `Cannot export an empty tree\nInsert some nodes first`
                });
                this.displayLogs();
                return;
            }

            const values = this.tree.inOrderTraversal(this.tree.root);
            const data = JSON.stringify(values, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'avl-tree.json';
            a.click();
            URL.revokeObjectURL(url);

            this.tree.logOperation('Export Success', `Exported tree with values: [${values.join(', ')}]`, {
                type: 'export',
                success: true,
                values: values,
                algorithm: `Export Algorithm:\n1. Perform in-order traversal to get sorted values\n2. Convert to JSON format\n3. Create downloadable file\n4. File contains array of node values`
            });
            this.displayLogs();
        });

        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        document.getElementById('fileInput').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const values = JSON.parse(e.target.result);
                    this.tree.logOperation('Import Start', `Importing values: [${values.join(', ')}]`, {
                        type: 'import',
                        values: values,
                        algorithm: `Import Algorithm:\n1. Parse JSON file\n2. Validate array of numbers\n3. Clear existing tree\n4. Insert each value with auto-balancing`
                    });
                    
                    this.tree.root = null;
                    values.forEach(value => {
                        if (typeof value === 'number') {
                            this.tree.root = this.tree.insert(this.tree.root, value);
                        }
                    });
                    this.render();
                    this.displayLogs();
                } catch (error) {
                    this.tree.logOperation('Import Failed', 'Invalid file format', {
                        type: 'import',
                        success: false,
                        error: error.message,
                        algorithm: `Import failed due to:\n1. Invalid JSON format\n2. File doesn't contain array of numbers\n3. Corrupted file data`
                    });
                    this.displayLogs();
                }
            };
            reader.readAsText(file);
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.tree.root = null;
            this.tree.clearLog();
            this.highlightedNode = null;
            this.selectedNode = null;
            this.traversalAnimator.stop();
            this.render();
            this.displayLogs();
            this.tree.logOperation('Tree Reset', 'Tree has been cleared', {
                type: 'reset',
                algorithm: `Reset Algorithm:\n1. Set root to null\n2. Clear operation log\n3. Clear any highlighted nodes\n4. Re-render empty tree`
            });
            this.displayLogs();
        });

        // Enter key support
        document.getElementById('inputValue').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('insertBtn').click();
            }
        });

        document.getElementById('searchValue').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('searchBtn').click();
            }
        });
    }

    setupTraversalControls() {
        // Visual traversal buttons
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

        g.appendChild(circle);
        g.appendChild(text);
        g.appendChild(heightText);
        svgGroup.appendChild(g);

        // Add click event listener
        g.addEventListener('click', () => {
            this.showNodeProperties(node.value);
        });
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
            const logClass = this.getLogClass(log.details.type);
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
                    <div class="log-time">${time}</div>
                </div>
            `;
        }).join('');
    }

    getLogClass(type) {
        switch (type) {
            case 'insert': return 'info';
            case 'delete': return 'danger';
            case 'search': return 'info';
            case 'rotation': return 'warning';
            case 'balance': return 'warning';
            case 'traversal': return 'info';
            case 'traversal-step': return 'info';
            case 'export': return 'info';
            case 'import': return 'info';
            case 'reset': return 'danger';
            case 'duplicate': return 'warning';
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