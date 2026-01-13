# Binary Tree Level Order Traversal

**LeetCode #102** | **Medium**

## Problem Statement

![img1](https://raw.githubusercontent.com/longlonglu/leetcode/main/images/Screenshot%202026-01-13%20at%2011.01.12.png)

Given the `root` of a binary tree, return the **level order traversal** of its nodes' values (i.e., from left to right, level by level).

## Examples

### Example 1:
```
Input: root = [3,9,20,null,null,15,7]
       3
      / \
     9  20
       /  \
      15   7

Output: [[3],[9,20],[15,7]]
```

### Example 2:
```
Input: root = [1]
Output: [[1]]
```

### Example 3:
```
Input: root = []
Output: []
```

## Constraints

- Number of nodes in the tree is in range `[0, 2000]`
- `-1000 <= Node.val <= 1000`

## TreeNode Definition

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
```

## Approach 1: BFS with Queue (Iterative)

### Intuition
Use Breadth-First Search (BFS) with a queue. Process all nodes at current level before moving to next level.

### Algorithm
```python
from collections import deque

def levelOrder(root):
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        # Process all nodes at current level
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            # Add children to queue
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(current_level)
    
    return result
```

### How It Works

**Example: [3,9,20,null,null,15,7]**

```
Initial:
queue = [3]
result = []

Level 0:
  Process: 3
  Add children: 9, 20
  queue = [9, 20]
  result = [[3]]

Level 1:
  Process: 9, 20
  Add children: 15, 7 (from 20)
  queue = [15, 7]
  result = [[3], [9, 20]]

Level 2:
  Process: 15, 7
  No children
  queue = []
  result = [[3], [9, 20], [15, 7]]
```

### Complexity
- **Time Complexity**: O(n) - visit each node once
- **Space Complexity**: O(n) - queue can hold up to n/2 nodes (last level)

## Approach 2: DFS (Recursive)

### Intuition
Use recursion with level tracking. Add nodes to appropriate level in result array.

### Algorithm
```python
def levelOrder(root):
    result = []
    
    def dfs(node, level):
        if not node:
            return
        
        # Create new level if needed
        if level == len(result):
            result.append([])
        
        # Add current node to its level
        result[level].append(node.val)
        
        # Recurse on children
        dfs(node.left, level + 1)
        dfs(node.right, level + 1)
    
    dfs(root, 0)
    return result
```

### How It Works

**Example: [3,9,20,null,null,15,7]**

```
dfs(3, level=0):
  result = [[3]]
  dfs(9, level=1):
    result = [[3], [9]]
  dfs(20, level=1):
    result = [[3], [9, 20]]
    dfs(15, level=2):
      result = [[3], [9, 20], [15]]
    dfs(7, level=2):
      result = [[3], [9, 20], [15, 7]]
```

### Complexity
- **Time Complexity**: O(n) - visit each node once
- **Space Complexity**: O(h) - recursion stack depth (h = height)

## Comparison

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| BFS (Queue) | O(n) | O(n) | **More intuitive for level order** | More space for wide trees |
| DFS (Recursive) | O(n) | O(h) | Less space for balanced trees | Less intuitive |

## Variations

### 1. Right to Left Level Order
```python
def levelOrderRightToLeft(root):
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            # Add right child first!
            if node.right:
                queue.append(node.right)
            if node.left:
                queue.append(node.left)
        
        result.append(current_level)
    
    return result
```

### 2. Bottom-Up Level Order (LeetCode #107)
```python
def levelOrderBottom(root):
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(current_level)
    
    return result[::-1]  # Reverse result
```

### 3. Zigzag Level Order (LeetCode #103)
```python
def zigzagLevelOrder(root):
    if not root:
        return []
    
    result = []
    queue = deque([root])
    left_to_right = True
    
    while queue:
        level_size = len(queue)
        current_level = deque()
        
        for _ in range(level_size):
            node = queue.popleft()
            
            # Append based on direction
            if left_to_right:
                current_level.append(node.val)
            else:
                current_level.appendleft(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(list(current_level))
        left_to_right = not left_to_right
    
    return result
```

### 4. Average of Each Level (LeetCode #637)
```python
def averageOfLevels(root):
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        level_sum = 0
        
        for _ in range(level_size):
            node = queue.popleft()
            level_sum += node.val
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level_sum / level_size)
    
    return result
```

## Edge Cases

1. **Empty tree**:
   ```python
   root = None  # Output: []
   ```

2. **Single node**:
   ```python
   root = TreeNode(1)  # Output: [[1]]
   ```

3. **Only left children** (skewed tree):
   ```python
        1
       /
      2
     /
    3
   # Output: [[1], [2], [3]]
   ```

4. **Complete binary tree**:
   ```python
        1
       / \
      2   3
     / \ / \
    4  5 6  7
   # Output: [[1], [2,3], [4,5,6,7]]
   ```

## Common Mistakes

1. **Not tracking level boundaries**:
   ```python
   # Wrong: Process queue without level awareness
   # Correct: Use level_size = len(queue)
   ```

2. **Modifying queue during iteration**:
   ```python
   # Wrong: for node in queue (queue changes during loop)
   # Correct: for _ in range(len(queue))
   ```

3. **Forgetting to check for None nodes**:
   ```python
   # Always check before adding to queue
   if node.left:
       queue.append(node.left)
   ```

4. **Using wrong data structure**:
   ```python
   # Use deque for O(1) popleft
   # List.pop(0) is O(n)
   from collections import deque
   queue = deque()
   ```

## Key Techniques

### BFS Template
```python
def bfs(root):
    if not root:
        return []
    
    queue = deque([root])
    
    while queue:
        level_size = len(queue)  # Critical for level tracking
        
        for _ in range(level_size):
            node = queue.popleft()
            # Process node
            
            # Add children
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
```

### DFS Template for Level Order
```python
def dfs_level_order(root):
    result = []
    
    def dfs(node, level):
        if not node:
            return
        
        if level == len(result):
            result.append([])
        
        result[level].append(node.val)
        dfs(node.left, level + 1)
        dfs(node.right, level + 1)
    
    dfs(root, 0)
    return result
```

## Related Problems

1. **LeetCode #107**: Binary Tree Level Order Traversal II (bottom-up)
2. **LeetCode #103**: Binary Tree Zigzag Level Order Traversal
3. **LeetCode #199**: Binary Tree Right Side View
4. **LeetCode #637**: Average of Levels in Binary Tree
5. **LeetCode #515**: Find Largest Value in Each Tree Row

## Tips for Interview

1. **Choose BFS for level order**:
   - More intuitive and natural
   - Easier to explain and implement

2. **Explain level tracking**:
   - Key insight: `level_size = len(queue)`
   - Process all current level before next

3. **Discuss variations**:
   - Right to left, bottom-up, zigzag
   - Shows understanding of BFS

4. **Mention DFS alternative**:
   - Shows knowledge of multiple approaches
   - Understand trade-offs

5. **Handle edge cases**:
   - Empty tree, single node
   - Skewed trees

6. **Optimize if asked**:
   - For very wide trees, consider memory
   - For deep trees, consider stack overflow in DFS
