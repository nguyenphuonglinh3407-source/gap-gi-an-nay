/**
 * Module quản lý lưu trữ lịch sử gắp món bằng localStorage
 * Giới hạn 10 lần gắp gần nhất
 */

const STORAGE_KEY = 'gap_gi_an_nay_history_v1';
const MAX_HISTORY_ITEMS = 10;

/**
 * Lấy danh sách lịch sử từ localStorage
 * @returns {Array} Mảng các món đã gắp
 */
export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Lỗi khi đọc lịch sử từ localStorage:', error);
    return [];
  }
}

/**
 * Thêm một món vừa gắp vào đầu danh sách lịch sử (tối đa 10 món)
 * @param {object} dish Món ăn vừa trúng thưởng
 * @returns {Array} Danh sách lịch sử cập nhật
 */
export function addHistoryItem(dish) {
  try {
    const history = getHistory();
    const historyItem = {
      id: dish.id,
      name: dish.name,
      category: dish.category,
      price: dish.price,
      emoji: dish.emoji,
      rarity: dish.rarity ? {
        name: dish.rarity.name,
        bgColor: dish.rarity.bgColor,
        textColor: dish.rarity.textColor,
        stars: dish.rarity.stars
      } : null,
      comment: dish.comment,
      timestamp: new Date().toISOString(),
      formattedTime: new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
      }).format(new Date())
    };

    // Đẩy lên đầu danh sách và giữ lại tối đa 10 phần tử
    const updated = [historyItem, ...history].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Lỗi khi lưu lịch sử vào localStorage:', error);
    return getHistory();
  }
}

/**
 * Xóa toàn bộ lịch sử gắp món
 */
export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (error) {
    console.error('Lỗi khi xóa lịch sử:', error);
    return [];
  }
}
