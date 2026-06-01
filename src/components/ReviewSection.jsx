import { useState } from 'react';
import { eventService } from '../services/eventService';

export const ReviewSection = ({ eventId, reviews, isAuthenticated, onReviewAdded }) => {
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            setError('Please write a comment before submitting.');
            return;
        }

        try {
            setSubmitting(true);
            setError('');
            
            // Gọi API gửi dữ liệu lên Backend
            const newReview = await eventService.addEventReview(eventId, {
                rating,
                comment: comment.trim()
            });

            // Gọi hàm callback đồng bộ hóa UI tức thì ở lớp cha Page Detail
            onReviewAdded(newReview);
            
            // Reset form sau khi gửi thành công
            setComment('');
            setRating(5);
            alert('Thank you for your feedback!');
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to submit your review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-black flex items-center gap-2">
                <span>💬</span> Participant Reviews ({reviews.length})
            </h3>

            {/* FORM THÊM ĐÁNH GIÁ MỚI */}
            {isAuthenticated ? (
                <form onSubmit={handleSubmitReview} className="bg-gray-50 rounded-xl p-4 space-y-4">
                    <h4 className="text-sm font-semibold text-gray-800">Share your experience</h4>
                    
                    {/* Chọn số sao trực quan (Click & Hover) */}
                    <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500 mr-2">Your Rating:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="focus:outline-none transition-transform active:scale-95"
                            >
                                <svg
                                    className={`w-6 h-6 ${(hoverRating || rating) >= star ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                            </button>
                        ))}
                        <span className="text-xs font-bold text-amber-600 ml-1">({rating}/5 stars)</span>
                    </div>

                    {/* Nội dung text bình luận */}
                    <div className="relative">
                        <textarea
                            rows="3"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="What did you like or dislike about this event?..."
                            className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FFA500] focus:border-[#FFA500] outline-none resize-none bg-white text-gray-800"
                        ></textarea>
                    </div>

                    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 text-xs bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                        >
                            {submitting ? 'Submitting...' : 'Post Review'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-center">
                    <p className="text-xs text-gray-500 italic">
                        Please <span className="font-semibold text-primary underline">login</span> to leave a review for this event.
                    </p>
                </div>
            )}

            {/* DANH SÁCH HIỂN THỊ CÁC BÌNH LUẬN CŨ */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {reviews.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No reviews yet. Be the first to review this event!</p>
                ) : (
                    reviews.map((rev) => (
                        <div key={rev.id} className="p-3 border-b border-gray-100 flex flex-col gap-1 bg-white">
                            <div className="flex items-center justify-between">
                                {/* Tên người dùng đánh giá */}
                                <span className="text-xs font-bold text-gray-800">
                                    {rev.user?.name || rev.user_name || 'Anonymous User'}
                                </span>
                                {/* Thời gian đánh giá */}
                                <span className="text-[10px] text-gray-400">
                                    {rev.created_at ? new Date(rev.created_at).toLocaleDateString('en-US') : 'Recent'}
                                </span>
                            </div>

                            {/* Số sao của bình luận cụ thể */}
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className={`w-3 h-3 ${star <= Number(rev.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                ))}
                            </div>

                            {/* Nội dung bình luận */}
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed bg-gray-50/50 p-2 rounded-md">
                                {rev.comment}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};