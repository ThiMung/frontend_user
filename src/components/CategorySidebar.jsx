import { Filter } from 'lucide-react';
import { formatCategoryLabel } from '../utils/categoryLabels';

const CategorySidebar = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <aside className="w-full lg:w-56 shrink-0 sticky top-0 lg:top-6 z-10 bg-white lg:bg-transparent max-lg:pt-2 max-lg:pb-3 max-lg:border-b max-lg:border-gray-100">
            <div className="hidden lg:flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-gray-500" />
                <h2 className="text-base font-semibold text-gray-800">Categories</h2>
            </div>
            
            <ul className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0 scrollbar-none snap-x">
                <li className="snap-center shrink-0">
                    <button
                        type="button"
                        onClick={() => onSelectCategory('all')}
                        className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                            selectedCategory === 'all'
                                ? 'bg-[#8B2635] text-white shadow-sm'
                                : 'bg-[#FFF5F0] text-gray-600 hover:bg-[#fdeee6]'
                        }`}
                    >
                        All Categories
                    </button>
                </li>

                {categories.map((category) => (
                    <li key={category} className="snap-center shrink-0">
                        <button
                            type="button"
                            onClick={() => onSelectCategory(category)}
                            className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                selectedCategory === category
                                    ? 'bg-[#8B2635] text-white shadow-sm'
                                    : 'bg-[#FFF5F0] text-gray-600 hover:bg-[#fdeee6]'
                            }`}
                        >
                            {formatCategoryLabel(category)}
                        </button>
                    </li>
                ))}
            </ul>
        </aside>
    );
};
export default CategorySidebar;