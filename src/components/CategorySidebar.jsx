import React from 'react';
import { Filter } from 'lucide-react';
import { formatCategoryLabel } from '../utils/categoryLabels';

const CategorySidebar = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        /* CHỈNH SỬA TẠI ĐÂY (Thẻ <aside> ngoài cùng):
          - lg:sticky lg:top-6 z-10: Cố định sidebar cách mép trên màn hình 24px khi cuộn trang trên máy tính.
          - max-lg:sticky max-lg:top-0 max-lg:bg-white max-lg:pb-3: Trên mobile biến thành thanh top-bar bám sát đỉnh màn hình.
          - w-full lg:w-56 shrink-0: Mobile rộng tối đa, Desktop thu gọn về đúng 224px.
        */
        <aside className="w-full lg:w-56 shrink-0 sticky top-0 lg:top-6 z-10 bg-white lg:bg-transparent max-lg:pt-2 max-lg:pb-3 max-lg:border-b max-lg:border-gray-100">
            
            {/* Tiêu đề - Ẩn trên thiết bị di động (hidden lg:flex) để giao diện mobile gọn gàng hơn */}
            <div className="hidden lg:flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-gray-500" />
                <h2 className="text-base font-semibold text-gray-800">Categories</h2>
            </div>
            
            {/* CHỈNH SỬA CẤU TRÚC DANH SÁCH (Thẻ <ul>):
              - max-lg:flex-row max-lg:overflow-x-auto max-lg:px-6: Trên điện thoại, đổi hướng thành hàng ngang 
                và cho phép vuốt trượt ngang (Horizontal Scroll) mượt mà bằng ngón tay.
              - lg:flex-col: Trên màn hình máy tính lớn, tự động trả về dạng cột dọc đứng im bên trái.
            */}
            <ul className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0 scrollbar-none snap-x">
                {/* Mục 'All Categories' (Tất cả danh mục) */}
                <li className="snap-center shrink-0">
                    <button
                        type="button"
                        onClick={() => onSelectCategory('all')}
                        /* whitespace-nowrap: Ngăn chữ bị xuống hàng khi hiển thị dạng thanh trượt ngang trên điện thoại */
                        className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                            selectedCategory === 'all'
                                ? 'bg-[#8B2635] text-white shadow-sm'
                                : 'bg-[#FFF5F0] text-gray-600 hover:bg-[#fdeee6]'
                        }`}
                    >
                        All Categories
                    </button>
                </li>

                {/* Duyệt qua mảng dữ liệu categories lấy từ Backend */}
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