/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {
    strs.sort();
    let i = 0;
    const first = strs[0];
    const last = strs[strs.length - 1];
    while (i < first.length && first[i] == last[i])
        i++
    return first.slice(0, i);
};