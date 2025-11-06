// Solution 1: Apply mathematics
// For the sum of 1+2+3+...+n, we can group numbers into pairs that each sum to (n+1).
// We will have n/2 such pairs.
// So, the total sum is (n+1) * n/2.
// Since either n or (n+1) is always even, we don't need to worry about whether n is even or odd.
// The time complexity is O(1) (constant time).
// The space complexity is O(1).
var sum_to_n_a = function(n) {
    return n * (n+1) / 2
};

// Solution 2: Using loop
// It's a basic way within loop
// The time complexity is O(n).
// The space complexity is O(1) because just store sum and i.
var sum_to_n_b = function(n) {
    let sum = 0;
    for (var i = 1; i <= n; i++) {
        sum += i
    }
    return sum;
};

// Solution 3: Recursive
// sum(n) = n + sum(n-1), with sum(0)
// The time complexity is O(n).
// The space complexity is O(n) because need to remember each sum, that is sum(n), sum(n-1), sum(n-2)...
var sum_to_n_c = function(n) {
    if (n === 0) return 0;
    return sum_to_n_c(n - 1) + n
};
