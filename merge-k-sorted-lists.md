# Merge K Sorted Lists

**LeetCode #23** | **Hard**

## Problem Statement

You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.

## Examples

### Example 1:
```
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]
Explanation: The linked-lists are:
[
  1->4->5,
  1->3->4,
  2->6
]
merging them into one sorted list:
1->1->2->3->4->4->5->6
```

### Example 2:
```
Input: lists = []
Output: []
```

### Example 3:
```
Input: lists = [[]]
Output: []
```

## Constraints

- `k == lists.length`
- `0 <= k <= 10^4`
- `0 <= lists[i].length <= 500`
- `-10^4 <= lists[i][j] <= 10^4`
- `lists[i]` is sorted in ascending order
- Sum of `lists[i].length` won't exceed `10^4`

## ListNode Definition

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
```

## Approach 1: Brute Force

### Intuition
Collect all nodes, sort them, and rebuild the list.

### Algorithm
```python
def mergeKLists(lists):
    nodes = []
    
    # Collect all nodes
    for head in lists:
        curr = head
        while curr:
            nodes.append(curr.val)
            curr = curr.next
    
    # Sort all values
    nodes.sort()
    
    # Build new list
    dummy = ListNode(0)
    curr = dummy
    for val in nodes:
        curr.next = ListNode(val)
        curr = curr.next
    
    return dummy.next
```

### Complexity
- **Time Complexity**: O(N log N) where N = total nodes
- **Space Complexity**: O(N) for storing nodes

## Approach 2: Compare One by One

### Intuition
Repeatedly find the minimum among k list heads, add to result, and advance that list.

### Algorithm
```python
def mergeKLists(lists):
    dummy = ListNode(0)
    curr = dummy
    
    while True:
        # Find list with minimum head value
        min_idx = -1
        min_val = float('inf')
        
        for i, head in enumerate(lists):
            if head and head.val < min_val:
                min_val = head.val
                min_idx = i
        
        # All lists exhausted
        if min_idx == -1:
            break
        
        # Add minimum node to result
        curr.next = lists[min_idx]
        lists[min_idx] = lists[min_idx].next
        curr = curr.next
    
    return dummy.next
```

### Complexity
- **Time Complexity**: O(N * k) where N = total nodes, k = number of lists
- **Space Complexity**: O(1)

## Approach 3: Min Heap (Priority Queue) - Optimal

### Intuition
Use a min heap to efficiently find the minimum among k list heads. This reduces the comparison from O(k) to O(log k).

### Algorithm
```python
import heapq

def mergeKLists(lists):
    # Min heap: (value, list_index, node)
    heap = []
    
    # Initialize heap with first node from each list
    for i, head in enumerate(lists):
        if head:
            heapq.heappush(heap, (head.val, i, head))
    
    dummy = ListNode(0)
    curr = dummy
    
    while heap:
        # Pop minimum
        val, i, node = heapq.heappop(heap)
        
        # Add to result
        curr.next = node
        curr = curr.next
        
        # Add next node from same list
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    
    return dummy.next
```

### How It Works

**Example: lists = [[1,4,5], [1,3,4], [2,6]]**

```
Initial heap: [(1,0,node1), (1,1,node1), (2,2,node2)]

Step 1: Pop (1,0,node1)
  - Add 1 to result
  - Push (4,0,node4)
  - heap: [(1,1,node1), (2,2,node2), (4,0,node4)]

Step 2: Pop (1,1,node1)
  - Add 1 to result
  - Push (3,1,node3)
  - heap: [(2,2,node2), (3,1,node3), (4,0,node4)]

Step 3: Pop (2,2,node2)
  - Add 2 to result
  - Push (6,2,node6)
  - heap: [(3,1,node3), (4,0,node4), (6,2,node6)]

Continue until heap is empty...
Result: 1->1->2->3->4->4->5->6
```

### Complexity
- **Time Complexity**: O(N log k)
  - N nodes total, each pushed/popped once
  - Each heap operation is O(log k)
- **Space Complexity**: O(k) for heap

## Approach 4: Divide and Conquer

### Intuition
Merge lists in pairs recursively, like merge sort.

### Algorithm
```python
def mergeKLists(lists):
    if not lists:
        return None
    
    def mergeTwoLists(l1, l2):
        dummy = ListNode(0)
        curr = dummy
        
        while l1 and l2:
            if l1.val < l2.val:
                curr.next = l1
                l1 = l1.next
            else:
                curr.next = l2
                l2 = l2.next
            curr = curr.next
        
        curr.next = l1 or l2
        return dummy.next
    
    # Divide and conquer
    interval = 1
    while interval < len(lists):
        for i in range(0, len(lists) - interval, interval * 2):
            lists[i] = mergeTwoLists(lists[i], lists[i + interval])
        interval *= 2
    
    return lists[0] if lists else None
```

### Visualization
```
Round 1: Merge pairs
[1->4->5, 1->3->4, 2->6, 3->7]
    ↓         ↓         ↓       ↓
[1->1->3->4->4->5,  2->3->6->7]

Round 2: Merge pairs again
[1->1->3->4->4->5,  2->3->6->7]
         ↓               ↓
[1->1->2->3->3->4->4->5->6->7]
```

### Complexity
- **Time Complexity**: O(N log k)
  - log k rounds of merging
  - Each round processes all N nodes
- **Space Complexity**: O(1) (not counting recursion stack)

## Comparison of Approaches

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| Brute Force | O(N log N) | O(N) | Simple | Doesn't use sorted property |
| Compare One by One | O(N*k) | O(1) | Simple | Inefficient for large k |
| Min Heap | O(N log k) | O(k) | **Optimal for most cases** | Requires heap |
| Divide & Conquer | O(N log k) | O(1) | **Best space complexity** | More complex |

## Edge Cases

1. **Empty input**:
   ```python
   lists = []  # Output: None
   ```

2. **All empty lists**:
   ```python
   lists = [[], [], []]  # Output: None
   ```

3. **Single list**:
   ```python
   lists = [[1,2,3]]  # Output: 1->2->3
   ```

4. **Lists of different lengths**:
   ```python
   lists = [[1], [1,3,4], [2,6,8,9]]
   ```

## Common Mistakes

1. **Not handling empty lists**:
   ```python
   # Check if head exists before accessing
   if head:
       heapq.heappush(heap, ...)
   ```

2. **Heap comparison of nodes**:
   ```python
   # Python 3 can't compare ListNode objects
   # Solution: include list index in tuple
   (node.val, i, node)
   ```

3. **Forgetting to advance pointer**:
   ```python
   # Must move to next node
   if node.next:
       heapq.heappush(heap, ...)
   ```

## Follow-up Questions

1. **What if lists are not sorted?**
   - Must use brute force approach (collect, sort, rebuild)

2. **What if k is very large (millions)?**
   - Min heap still efficient O(N log k)
   - Divide & conquer might be better for space

3. **Can we do it in-place?**
   - Yes, with divide & conquer
   - Just reconnect existing nodes

## Tips for Interview

1. **Start with merge two lists**:
   - Show you understand the basic operation
   - Then extend to k lists

2. **Discuss trade-offs**:
   - Min heap vs divide & conquer
   - Time vs space complexity

3. **Consider k size**:
   - Small k: compare one by one might be fine
   - Large k: heap or divide & conquer

4. **Handle edge cases**:
   - Empty lists
   - Single list
   - Different length lists

5. **Optimize further**:
   - Could use merge two at a time iteratively
   - Could parallelize divide & conquer
