/**
 * Calculate progress percentage for a checklist
 * @param {Array} checklist - Array of checklist items
 * @returns {number} - Progress percentage (0-100)
 */
export const calculateProgress = (checklist) => {
    if (!checklist || checklist.length === 0) return 0;
    const completedItems = checklist.filter(item => item.checked).length;
    return Math.round((completedItems / checklist.length) * 100);
};