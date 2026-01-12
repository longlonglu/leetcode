# LRU Cache

**LeetCode #146** | **Medium**

## Problem Statement

Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the `LRUCache` class:

- `LRUCache(int capacity)`: Initialize the LRU cache with positive size capacity
- `int get(int key)`: Return the value of the key if it exists, otherwise return -1
- `void put(int key, int value)`: Update the value of the key if it exists. Otherwise, add the key-value pair. If the number of keys exceeds the capacity, evict the least recently used key.

The functions `get` and `put` must each run in **O(1) average time complexity**.

## Examples

### Example 1:
```
Input:
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]

Output:
[null, null, null, 1, null, -1, null, -1, 3, 4]

Explanation:
LRUCache lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // cache is {1=1}
lRUCache.put(2, 2); // cache is {1=1, 2=2}
lRUCache.get(1);    // return 1
lRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}
lRUCache.get(2);    // returns -1 (not found)
lRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}
lRUCache.get(1);    // return -1 (not found)
lRUCache.get(3);    // return 3
lRUCache.get(4);    // return 4
```

## Constraints

- `1 <= capacity <= 3000`
- `0 <= key <= 10^4`
- `0 <= value <= 10^5`
- At most `2 * 10^5` calls will be made to `get` and `put`

## Approach: Hash Map + Doubly Linked List

### Intuition

To achieve O(1) for both operations, we need:
1. **Hash Map**: O(1) access to cache items by key
2. **Doubly Linked List**: O(1) removal and insertion for LRU ordering

### Why Doubly Linked List?
- **Head**: Most recently used
- **Tail**: Least recently used
- **O(1) removal**: Can remove any node given pointer
- **O(1) insertion**: Can insert at head

### Data Structure

```python
class Node:
    def __init__(self, key=0, value=0):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}  # key -> node
        
        # Dummy head and tail for easier operations
        self.head = Node()
        self.tail = Node()
        self.head.next = self.tail
        self.tail.prev = self.head
```

### Core Operations

#### 1. Add Node to Head (Most Recent)
```python
def _add_to_head(self, node):
    node.prev = self.head
    node.next = self.head.next
    self.head.next.prev = node
    self.head.next = node
```

#### 2. Remove Node from List
```python
def _remove_node(self, node):
    node.prev.next = node.next
    node.next.prev = node.prev
```

#### 3. Move to Head (Make Most Recent)
```python
def _move_to_head(self, node):
    self._remove_node(node)
    self._add_to_head(node)
```

#### 4. Remove Tail (Evict LRU)
```python
def _remove_tail(self):
    lru_node = self.tail.prev
    self._remove_node(lru_node)
    return lru_node
```

### Complete Implementation

```python
class Node:
    def __init__(self, key=0, value=0):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}
        
        # Dummy nodes for cleaner code
        self.head = Node()
        self.tail = Node()
        self.head.next = self.tail
        self.tail.prev = self.head
    
    def _add_to_head(self, node):
        """Add node right after head"""
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node
    
    def _remove_node(self, node):
        """Remove node from linked list"""
        node.prev.next = node.next
        node.next.prev = node.prev
    
    def _move_to_head(self, node):
        """Move existing node to head (most recent)"""
        self._remove_node(node)
        self._add_to_head(node)
    
    def _remove_tail(self):
        """Remove LRU node (before tail)"""
        lru = self.tail.prev
        self._remove_node(lru)
        return lru
    
    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        
        # Move to head (mark as recently used)
        node = self.cache[key]
        self._move_to_head(node)
        return node.value
    
    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            # Update existing key
            node = self.cache[key]
            node.value = value
            self._move_to_head(node)
        else:
            # Add new key
            new_node = Node(key, value)
            self.cache[key] = new_node
            self._add_to_head(new_node)
            
            # Evict LRU if over capacity
            if len(self.cache) > self.capacity:
                lru = self._remove_tail()
                del self.cache[lru.key]
```

## Visualization

### Example: capacity = 2

```
Initial: head <-> tail

After put(1, 1):
head <-> [1:1] <-> tail
cache: {1: node1}

After put(2, 2):
head <-> [2:2] <-> [1:1] <-> tail
cache: {1: node1, 2: node2}

After get(1):
head <-> [1:1] <-> [2:2] <-> tail
cache: {1: node1, 2: node2}
(1 moved to head, most recently used)

After put(3, 3):
head <-> [3:3] <-> [1:1] <-> tail
cache: {1: node1, 3: node3}
(2 evicted as LRU)
```

## Alternative: OrderedDict (Python)

Python's `OrderedDict` maintains insertion order and supports O(1) move to end:

```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.cache = OrderedDict()
        self.capacity = capacity
    
    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        
        # Move to end (most recent)
        self.cache.move_to_end(key)
        return self.cache[key]
    
    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            # Update and move to end
            self.cache.move_to_end(key)
        
        self.cache[key] = value
        
        # Evict LRU if over capacity
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)  # Remove first (oldest)
```

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| get() | O(1) | - |
| put() | O(1) | - |
| Overall Space | - | O(capacity) |

## Edge Cases

1. **Capacity = 1**:
   ```python
   cache = LRUCache(1)
   cache.put(1, 1)  # {1:1}
   cache.put(2, 2)  # {2:2}, evicts 1
   cache.get(1)     # -1
   ```

2. **Update existing key**:
   ```python
   cache.put(1, 1)  # {1:1}
   cache.put(1, 10) # {1:10}, updates value
   ```

3. **Multiple gets**:
   ```python
   cache.put(1, 1)  # {1:1}
   cache.put(2, 2)  # {2:2, 1:1}
   cache.get(1)     # 1, makes 1 most recent
   cache.put(3, 3)  # Evicts 2, not 1
   ```

## Common Mistakes

1. **Not updating on get()**:
   ```python
   # Wrong: return value without moving to head
   # Correct: move to head then return
   ```

2. **Wrong eviction order**:
   ```python
   # Must evict from tail (LRU)
   # Not from head (most recent)
   ```

3. **Forgetting to remove from hash map**:
   ```python
   # When evicting, must:
   # 1. Remove from linked list
   # 2. Delete from hash map
   del self.cache[lru.key]
   ```

4. **Not handling dummy nodes correctly**:
   ```python
   # Use dummy head/tail to avoid null checks
   # Actual nodes between head and tail
   ```

## Follow-up Questions

1. **Implement LFU (Least Frequently Used) instead**:
   - Track frequency of each key
   - Evict least frequently used
   - Requires additional data structures

2. **Make it thread-safe**:
   - Add locks around operations
   - Use concurrent data structures

3. **Implement TTL (Time-to-Live)**:
   - Track expiration time for each entry
   - Remove expired entries automatically

4. **Optimize for specific access patterns**:
   - Could use different eviction policies
   - Segment cache by access frequency

## Real-World Applications

1. **Web Browsers**: Cache recently visited pages
2. **Database Query Cache**: Cache frequent queries
3. **CDN**: Cache popular content at edge servers
4. **Operating Systems**: Page replacement algorithms
5. **CPU Caches**: L1/L2/L3 cache management

## Tips for Interview

1. **Start with requirements**:
   - O(1) operations for both get and put
   - Need both fast lookup and ordering

2. **Explain data structure choice**:
   - Why hash map + doubly linked list
   - Trade-offs of other approaches

3. **Walk through operations**:
   - Draw the linked list
   - Show how nodes move

4. **Handle edge cases**:
   - Capacity = 1
   - Update existing key
   - Multiple operations

5. **Mention OrderedDict**:
   - Cleaner Python solution
   - But demonstrate knowledge of underlying implementation

6. **Discuss variations**:
   - LFU, TTL, weighted LRU
   - Different eviction policies
