# Two Sum

**LeetCode #1** | **Easy**

## Problem Statement

Given an array of integers `nums` and an integer `target`, return **indices** of the two numbers such that they add up to `target`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.

## Examples

### Example 1:
```
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
```

### Example 2:
```
Input: nums = [3,2,4], target = 6
Output: [1,2]
```

### Example 3:
```
Input: nums = [3,3], target = 6
Output: [0,1]
```

## Constraints

- `2 <= nums.length <= 10^4`
- `-10^9 <= nums[i] <= 10^9`
- `-10^9 <= target <= 10^9`
- Only one valid answer exists

## Approach 1: Brute Force

### Intuition
Check every possible pair of numbers to see if they sum to the target.

### Algorithm
```python
def twoSum(nums, target):
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []
```

### Complexity
- **Time Complexity**: O(n²) - nested loops
- **Space Complexity**: O(1) - no extra space

## Approach 2: Hash Map (Optimal)

### Intuition
For each number `x`, we need to find if `target - x` exists in the array. Use a hash map to store numbers we've seen and their indices.

### Algorithm
1. Create empty hash map
2. For each number in array:
   - Calculate complement = target - current number
   - If complement exists in hash map, return indices
   - Otherwise, add current number to hash map

```python
def twoSum(nums, target):
    seen = {}  # value -> index
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in seen:
            return [seen[complement], i]
        
        seen[num] = i
    
    return []
```

### Why This Works
- We only need to pass through the array once
- Hash map lookup is O(1) on average
- We store each number as we go, so when we find a complement, we already have its index

### Example Walkthrough
```
nums = [2, 7, 11, 15], target = 9

i=0, num=2, complement=7
  - 7 not in seen
  - seen = {2: 0}

i=1, num=7, complement=2
  - 2 in seen! (at index 0)
  - return [0, 1]
```

### Complexity
- **Time Complexity**: O(n) - single pass through array
- **Space Complexity**: O(n) - hash map storage

## Edge Cases to Consider

1. **Duplicate values**:
   ```python
   nums = [3, 3], target = 6
   # Should return [0, 1]
   ```

2. **Negative numbers**:
   ```python
   nums = [-1, -2, -3, -4, -5], target = -8
   # Should return [2, 4] (or other valid pair)
   ```

3. **Zero in array**:
   ```python
   nums = [0, 4, 3, 0], target = 0
   # Should return [0, 3]
   ```

## Common Mistakes

1. **Using same element twice**:
   ```python
   # Wrong: if nums[i] * 2 == target
   # Correct: Check i != j or use hash map
   ```

2. **Returning values instead of indices**:
   ```python
   # Wrong: return [nums[i], nums[j]]
   # Correct: return [i, j]
   ```

3. **Not handling duplicates**:
   ```python
   # Hash map approach naturally handles this
   # by storing latest index
   ```

## Follow-up Questions

1. **What if the array is sorted?**
   - Use two-pointer technique: O(n) time, O(1) space

2. **What if we need to find all pairs?**
   - Modify to collect all solutions instead of returning first

3. **What if we can't use extra space?**
   - Must use brute force O(n²) approach

## Tips for Interview

1. **Clarify requirements**:
   - Is array sorted?
   - Can same element be used twice?
   - Multiple solutions or just one?

2. **Start with brute force**:
   - Shows you understand the problem
   - Then optimize to hash map solution

3. **Explain trade-offs**:
   - Time vs space complexity
   - Why hash map is optimal here

4. **Test edge cases**:
   - Empty array (though constraints say n >= 2)
   - Duplicates
   - Negative numbers
