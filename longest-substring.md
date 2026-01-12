# Longest Substring Without Repeating Characters

**LeetCode #3** | **Medium**

## Problem Statement

Given a string `s`, find the length of the **longest substring** without repeating characters.

## Examples

### Example 1:
```
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
```

### Example 2:
```
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
```

### Example 3:
```
Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.
Note that "pwke" is a subsequence, not a substring.
```

### Example 4:
```
Input: s = ""
Output: 0
```

## Constraints

- `0 <= s.length <= 5 * 10^4`
- `s` consists of English letters, digits, symbols and spaces

## Approach 1: Brute Force

### Intuition
Check all possible substrings and find the longest one without repeating characters.

### Algorithm
```python
def lengthOfLongestSubstring(s):
    def has_duplicate(substring):
        return len(substring) != len(set(substring))
    
    max_length = 0
    n = len(s)
    
    for i in range(n):
        for j in range(i + 1, n + 1):
            substring = s[i:j]
            if not has_duplicate(substring):
                max_length = max(max_length, len(substring))
    
    return max_length
```

### Complexity
- **Time Complexity**: O(n³) - O(n²) substrings, O(n) to check each
- **Space Complexity**: O(min(n, m)) where m is charset size

## Approach 2: Sliding Window with Set (Optimal)

### Intuition
Use two pointers (sliding window) to maintain a window of unique characters. When we encounter a duplicate, shrink window from left.

### Algorithm
```python
def lengthOfLongestSubstring(s):
    char_set = set()
    left = 0
    max_length = 0
    
    for right in range(len(s)):
        # Shrink window until no duplicates
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        
        # Add current character
        char_set.add(s[right])
        
        # Update max length
        max_length = max(max_length, right - left + 1)
    
    return max_length
```

### How It Works

**Example: s = "abcabcbb"**

```
Step 1: right=0, left=0, char='a'
  window = [a], set = {a}, max_length = 1

Step 2: right=1, left=0, char='b'
  window = [a,b], set = {a,b}, max_length = 2

Step 3: right=2, left=0, char='c'
  window = [a,b,c], set = {a,b,c}, max_length = 3

Step 4: right=3, left=0, char='a' (duplicate!)
  - Remove 'a' from left: window = [b,c], left=1
  - Add 'a': window = [b,c,a], set = {b,c,a}
  - max_length = 3

Step 5: right=4, left=1, char='b' (duplicate!)
  - Remove 'b' from left: window = [c,a], left=2
  - Add 'b': window = [c,a,b], set = {c,a,b}
  - max_length = 3
```

### Complexity
- **Time Complexity**: O(2n) = O(n) - each char visited twice max
- **Space Complexity**: O(min(n, m)) where m is charset size

## Approach 3: Sliding Window with HashMap (Most Efficient)

### Intuition
Instead of removing characters one by one from left, jump directly to the position after the duplicate character.

### Algorithm
```python
def lengthOfLongestSubstring(s):
    char_index = {}  # char -> index
    left = 0
    max_length = 0
    
    for right, char in enumerate(s):
        # If char seen before and within current window
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        
        # Update character's latest index
        char_index[char] = right
        
        # Update max length
        max_length = max(max_length, right - left + 1)
    
    return max_length
```

### Why This Is Better
- No need to remove characters one by one
- Jump directly to correct position
- Still O(n) but with single pass

### Example Walkthrough
```
s = "abba"

right=0, char='a', left=0
  char_index = {'a': 0}
  max_length = 1

right=1, char='b', left=0
  char_index = {'a': 0, 'b': 1}
  max_length = 2

right=2, char='b', left=0
  'b' at index 1 >= left (0)
  left = 1 + 1 = 2
  char_index = {'a': 0, 'b': 2}
  max_length = 2

right=3, char='a', left=2
  'a' at index 0 < left (2), so no jump
  char_index = {'a': 3, 'b': 2}
  max_length = 2
```

### Complexity
- **Time Complexity**: O(n) - single pass
- **Space Complexity**: O(min(n, m)) - hash map size

## Edge Cases

1. **Empty string**:
   ```python
   s = ""  # Output: 0
   ```

2. **All unique characters**:
   ```python
   s = "abcdef"  # Output: 6
   ```

3. **All same characters**:
   ```python
   s = "aaaa"  # Output: 1
   ```

4. **Single character**:
   ```python
   s = "a"  # Output: 1
   ```

## Common Mistakes

1. **Not updating left pointer correctly**:
   ```python
   # Wrong: left = char_index[char]
   # Correct: left = max(left, char_index[char] + 1)
   ```

2. **Forgetting to update character's index**:
   ```python
   # Must update even if char was seen before
   char_index[char] = right
   ```

3. **Not checking if duplicate is within window**:
   ```python
   # Check: char_index[char] >= left
   ```

## Variations

1. **Find the actual substring** (not just length):
   ```python
   def longestSubstring(s):
       char_index = {}
       left = 0
       max_length = 0
       result = ""
       
       for right, char in enumerate(s):
           if char in char_index and char_index[char] >= left:
               left = char_index[char] + 1
           
           char_index[char] = right
           
           if right - left + 1 > max_length:
               max_length = right - left + 1
               result = s[left:right+1]
       
       return result
   ```

2. **At most K distinct characters**:
   - Similar approach but track count of distinct chars
   - Shrink when distinct > k

## Tips for Interview

1. **Start with examples**:
   - Draw the sliding window
   - Show how pointers move

2. **Explain the optimization**:
   - Why sliding window is better than brute force
   - How hash map improves efficiency

3. **Discuss space-time tradeoff**:
   - Could avoid hash map but would be O(n²)

4. **Handle follow-ups**:
   - What if we need the actual substring?
   - What if we have constraints on charset?
