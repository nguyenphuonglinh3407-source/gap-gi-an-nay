/**
 * Module xử lý hệ thống độ hiếm và logic gacha ngẫu nhiên có trọng số
 */

export const RARITY_CONFIG = {
  binh_dan: {
    id: 'binh_dan',
    name: 'Bình dân',
    subtitle: 'Ngon - Bổ - Cực hạt dẻ',
    maxPrice: 30000,
    weight: 45, // Tỉ lệ xuất hiện cao nhất
    bgColor: '#B8EBD6', // Xanh bạc hà pastel
    textColor: '#245E47',
    capsuleColor: '#A8E6CF',
    stars: '★☆☆☆☆',
    icon: '🌱'
  },
  ngon_bat_ngo: {
    id: 'ngon_bat_ngo',
    name: 'Ngon bất ngờ',
    subtitle: 'Vừa túi tiền, ấm lòng dạ dày',
    maxPrice: 50000,
    weight: 30,
    bgColor: '#FFE6A7', // Vàng bơ pastel
    textColor: '#6B5418',
    capsuleColor: '#FFD369',
    stars: '★★☆☆☆',
    icon: '✨'
  },
  hoi_sang_nha: {
    id: 'hoi_sang_nha',
    name: 'Hơi sang nha',
    subtitle: 'Nâng tầm bữa ăn, chiều chuộng bản thân',
    maxPrice: 80000,
    weight: 15,
    bgColor: '#FFB6C8', // Hồng kẹo pastel
    textColor: '#732B3E',
    capsuleColor: '#FFAAA6',
    stars: '★★★☆☆',
    icon: '💖'
  },
  vi_khoc_thet: {
    id: 'vi_khoc_thet',
    name: 'Ví khóc thét',
    subtitle: 'Cơm áo gạo tiền xin đứng sang một bên!',
    maxPrice: 140000,
    weight: 7,
    bgColor: '#D4C6F5', // Tím lavender pastel
    textColor: '#4B367C',
    capsuleColor: '#C3B1E1',
    stars: '★★★★☆',
    icon: '💸'
  },
  luong_ve_moi_dam: {
    id: 'luong_ve_moi_dam',
    name: 'Lương về mới dám',
    subtitle: 'Cực phẩm đại gia, ăn xong cạp đất một tuần',
    maxPrice: Infinity,
    weight: 3, // Cực hiếm
    bgColor: '#FFD199', // Cam đào ánh kim
    textColor: '#6E3A07',
    capsuleColor: '#FFBA7A',
    stars: '★★★★★',
    icon: '👑'
  }
};

/**
 * Xác định độ hiếm dựa trên giá tiền món ăn
 * @param {number} price 
 * @returns {object} Thông tin độ hiếm
 */
export function getRarityByPrice(price) {
  if (price <= RARITY_CONFIG.binh_dan.maxPrice) {
    return RARITY_CONFIG.binh_dan;
  }
  if (price <= RARITY_CONFIG.ngon_bat_ngo.maxPrice) {
    return RARITY_CONFIG.ngon_bat_ngo;
  }
  if (price <= RARITY_CONFIG.hoi_sang_nha.maxPrice) {
    return RARITY_CONFIG.hoi_sang_nha;
  }
  if (price <= RARITY_CONFIG.vi_khoc_thet.maxPrice) {
    return RARITY_CONFIG.vi_khoc_thet;
  }
  return RARITY_CONFIG.luong_ve_moi_dam;
}

/**
 * Chọn ngẫu nhiên một món ăn theo trọng số độ hiếm
 * Các món bình dân sẽ có cơ hội gắp trúng cao hơn các món siêu đắt tiền
 * @param {Array} dishPool Danh sách món đã qua bộ lọc
 * @returns {object|null} Món trúng thưởng kèm độ hiếm
 */
export function rollGacha(dishPool) {
  if (!dishPool || dishPool.length === 0) {
    return null;
  }

  // Gán trọng số cho từng món trong pool dựa vào độ hiếm
  const itemsWithWeights = dishPool.map(dish => {
    const rarity = getRarityByPrice(dish.price);
    return {
      dish,
      rarity,
      weight: rarity.weight
    };
  });

  const totalWeight = itemsWithWeights.reduce((sum, item) => sum + item.weight, 0);
  let randomValue = Math.random() * totalWeight;

  for (const item of itemsWithWeights) {
    if (randomValue < item.weight) {
      return {
        ...item.dish,
        rarity: item.rarity
      };
    }
    randomValue -= item.weight;
  }

  // Dự phòng trả về phần tử cuối nếu làm tròn số float
  const fallback = itemsWithWeights[itemsWithWeights.length - 1];
  return {
    ...fallback.dish,
    rarity: fallback.rarity
  };
}
