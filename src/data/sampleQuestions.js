export const sampleQuestions = [
  {
    _id: 'q1',
    text: 'What is the time complexity of binary search?',
    type: 'mcq',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'],
    points: 10
  },
  {
    _id: 'q2',
    text: 'Which sorting algorithm has the best average-case time complexity?',
    type: 'mcq',
    options: ['Bubble Sort', 'Insertion Sort', 'Quick Sort', 'Selection Sort', 'Merge Sort'],
    points: 10
  },
  {
    _id: 'q3',
    text: 'What is the space complexity of depth-first search (DFS) for a graph with V vertices and E edges?',
    type: 'mcq',
    options: ['O(1)', 'O(V)', 'O(E)', 'O(V + E)', 'O(V * E)'],
    points: 10
  },
  {
    _id: 'q4',
    text: 'Which data structure would be most efficient for implementing a priority queue?',
    type: 'mcq',
    options: ['Array', 'Linked List', 'Heap', 'Stack', 'Hash Table'],
    points: 10
  },
  {
    _id: 'q5',
    text: 'In Big O notation, the time complexity O(1) is also known as:',
    type: 'code',
    points: 10
  },
  {
    _id: 'q6',
    text: 'Write the JavaScript method that adds an element to the end of an array:',
    type: 'text',
    points: 10
  },
  {
    _id: 'q8',
    text: 'In a binary tree, a node that has no children is called a:',
    type: 'text',
    correctAnswer: 'leaf node',
    points: 10
  },
  {
    _id: 'q9',
    text: 'Given an array with n elements, what is the maximum number of comparisons needed to find the minimum element?',
    type: 'mcq',
    options: ['log n', 'n - 1', 'n', 'n log n', '2n'],
    correctAnswer: 'n - 1',
    points: 10
  },
  {
    _id: 'q10',
    text: 'Consider a problem that can be solved using dynamic programming. What property must subproblems have for dynamic programming to be applicable?',
    type: 'mcq',
    options: [
      'They must be unique',
      'They must overlap',
      'They must be independent',
      'They must be sequential',
      'They must be recursive'
    ],
    correctAnswer: 'They must overlap',
    points: 10
  },
  {
    _id: 'q11',
    text: 'Write a JavaScript function that calculates the sum of all elements in an array:',
    type: 'code',
    language: 'javascript',
    starterCode: 'function arraySum(arr) {\n  // Your code here\n}',
    testCases: [
      { input: '[1, 2, 3, 4, 5]', expectedOutput: '15' },
      { input: '[-1, -2, -3, -4, -5]', expectedOutput: '-15' },
      { input: '[0, 0, 0]', expectedOutput: '0' }
    ],
    points: 20
  },
  {
    _id: 'q12',
    text: 'Implement a function to reverse a string:',
    type: 'code',
    language: 'javascript',
    starterCode: 'function reverseString(str) {\n  // Your code here\n}',
    testCases: [
      { input: '"hello"', expectedOutput: '"olleh"' },
      { input: '"javascript"', expectedOutput: '"tpircsavaj"' },
      { input: '""', expectedOutput: '""' }
    ],
    points: 20
  }
]; 