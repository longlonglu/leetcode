# Valid Parentheses

**LeetCode #20** | **Easy**

## Problem Statement

Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets
2. Open brackets must be closed in the correct order
3. Every close bracket has a corresponding open bracket of the same type

## Examples

### Example 1:
```
Input: s = "()"
Output: true
```

### Example 2:
```
Input: s = "()[]{}"
Output: true
```

### Example 3:
```
Input: s = "(]"
Output: false
Explanation: '(' is closed by ']', not ')'
```

### Example 4:
```
Input: s = "([])"
Output: true
```

## Constraints

- `1 <= s.length <= 10^4`
- `s` consists of parentheses only: `'()[]{}'`

## Approach: Stack

### Intuition
- When we see an opening bracket, we expect the matching closing bracket later
- The most recent unmatched opening bracket should match the next closing bracket (LIFO)
- This is a perfect use case for a stack!

### Algorithm
```python
def isValid(s):
    # Stack to track opening brackets
    stack = []
    
    # Mapping of closing to opening brackets
    mapping = {
        ')': '(',
        '}': '{',
        ']': '['
    }
    
    for char in s:
        if char in mapping:  # Closing bracket
            # Check if stack is empty or top doesn't match
            if not stack or stack[-1] != mapping[char]:
                return False
            stack.pop()
        else:  # Opening bracket
            stack.append(char)
    
    # Valid only if all brackets are matched
    return len(stack) == 0
```

### How It Works

**Example: s = "([}}])"**

```
Step 1: char = '('
  - Opening bracket
  - stack = ['(']

Step 2: char = '['
  - Opening bracket
  - stack = ['(', '[']

Step 3: char = '}'
  - Closing bracket, expects '{'
  - Top of stack is '[', doesn't match!
  - return False

Correct example: s = "([{}])"

Step 1: '(' → stack = ['(']
Step 2: '[' → stack = ['(', '[']
Step 3: '{' → stack = ['(', '[', '{']
Step 4: '}' → matches '{', pop → stack = ['(', '[']
Step 5: ']' → matches '[', pop → stack = ['(']
Step 6: ')' → matches '(', pop → stack = []
Stack empty, return True
```

### Complexity
- **Time Complexity**: O(n) - single pass through string
- **Space Complexity**: O(n) - worst case all opening brackets

## Alternative Implementation

### Using Dictionary for Opening Brackets
```python
def isValid(s):
    stack = []
    pairs = {'(': ')', '[': ']', '{': '}'}
    
    for char in s:
        if char in pairs:  # Opening bracket
            stack.append(char)
        else:  # Closing bracket
            if not stack or pairs[stack[-1]] != char:
                return False
            stack.pop()
    
    return not stack
```

## Edge Cases

1. **Empty string**:
   ```python
   s = ""  # Output: true (vacuously valid)
   ```

2. **Only opening brackets**:
   ```python
   s = "((("  # Output: false (no closing)
   ```

3. **Only closing brackets**:
   ```python
   s = ")))"  # Output: false (no opening)
   ```

4. **Mismatched types**:
   ```python
   s = "([)]"  # Output: false
   # '(' is closed by ']' incorrectly
   ```

5. **Single bracket**:
   ```python
   s = "("  # Output: false
   s = ")"  # Output: false
   ```

## Step-by-Step Trace

**Example: s = "{[()]}"**

| Step | Char | Action | Stack | Valid? |
|------|------|--------|-------|--------|
| 1 | '{' | Push | ['{'] | - |
| 2 | '[' | Push | ['{', '['] | - |
| 3 | '(' | Push | ['{', '[', '('] | - |
| 4 | ')' | Match '(' and pop | ['{', '['] | ✓ |
| 5 | ']' | Match '[' and pop | ['{'] | ✓ |
| 6 | '}' | Match '{' and pop | [] | ✓ |
| End | - | Stack empty | [] | **True** |

**Example: s = "([)]"** (Invalid)

| Step | Char | Action | Stack | Valid? |
|------|------|--------|-------|--------|
| 1 | '(' | Push | ['('] | - |
| 2 | '[' | Push | ['(', '['] | - |
| 3 | ')' | Try to match '(' | Top is '[' | **False** |

## Common Mistakes

1. **Not checking if stack is empty before popping**:
   ```python
   # Wrong: stack.pop() without checking
   # Correct:
   if not stack or stack[-1] != expected:
       return False
   ```

2. **Not checking stack is empty at the end**:
   ```python
   # Must ensure all brackets are matched
   return len(stack) == 0  # or: return not stack
   ```

3. **Using wrong data structure**:
   ```python
   # Don't use queue or array
   # Stack is optimal for this problem
   ```

4. **Forgetting to handle unmatched opening brackets**:
   ```python
   s = "((("  # Must return False
   # Check: return len(stack) == 0
   ```

## Variations & Extensions

### 1. Return index of first invalid character
```python
def firstInvalidChar(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for i, char in enumerate(s):
        if char in mapping:
            if not stack or stack[-1] != mapping[char]:
                return i
            stack.pop()
        else:
            stack.append(char)
    
    return -1 if not stack else len(s) - 1
```

### 2. Minimum additions to make valid
```python
def minAddToMakeValid(s):
    stack = []
    for char in s:
        if char == ')' and stack and stack[-1] == '(':
            stack.pop()
        else:
            stack.append(char)
    return len(stack)
```

### 3. Remove invalid parentheses
```python
# More complex variation (different problem)
# Requires BFS or backtracking
```

## Real-World Applications

1. **Compilers**: Check syntax of code (brackets, braces)
2. **Text Editors**: Auto-complete and validate brackets
3. **Mathematical Expressions**: Validate formulas
4. **HTML/XML Parsers**: Validate tag matching
5. **JSON Validators**: Check object/array nesting

## Why Stack?

- **LIFO Property**: Last opened must be first closed
- **O(1) Operations**: Push and pop are constant time
- **Natural Fit**: Matches the problem's nested structure
- **Space Efficient**: Only stores unmatched brackets

## Tips for Interview

1. **Explain the pattern**:
   - Opening brackets: push to stack
   - Closing brackets: check and pop

2. **Draw it out**:
   - Show stack operations visually
   - Trace through examples

3. **Discuss edge cases**:
   - Empty string
   - Only opening/closing brackets
   - Mismatched types

4. **Mention use cases**:
   - Compilers, parsers, validators

5. **Optimize if needed**:
   - Could use array instead of list (if language matters)
   - Could track count instead of full stack (for single type)

## Follow-up Questions

1. **What if we only have one type of bracket?**
   - Can use counter instead of stack: O(1) space

2. **What if brackets can be nested but not interleaved?**
   - Similar approach, but simpler validation

3. **What if we need to return positions of unmatched brackets?**
   - Store indices in stack instead of just characters
