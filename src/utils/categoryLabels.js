export const formatCategoryLabel = (category) => {
    const labels = {
        'Food & Drink': 'Food and Drink',
        Arts: 'Art',
    };
    return labels[category] || category;
};
