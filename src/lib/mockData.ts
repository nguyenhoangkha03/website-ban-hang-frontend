import { Sprout, Wheat, Flower, Leaf, LucideIcon } from "lucide-react";

// Định nghĩa kiểu dữ liệu cho Sản phẩm
export interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  tag?: 'Mới' | 'Hot';
  tagColor?: string;
  type: string;
}

// Định nghĩa kiểu dữ liệu cho Danh mục (để dùng icon)
export interface CategoryItem {
  name: string;
  subtitle: string;
  icon: LucideIcon;
}

export const durianProducts: Product[] = [
  {
    id: 1,
    name: "Durian Shield 500SC",
    category: "Sầu riêng",
    image: "https://images.unsplash.com/photo-1595123550441-d377e017de6a?auto=format&fit=crop&q=80&w=500",
    tag: "Mới",
    tagColor: "bg-green-500",
    type: "Thuốc trừ bệnh"
  },
  {
    id: 2,
    name: "Siêu Lân Kẽm - Tạo mầm hoa",
    category: "Sầu riêng",
    image: "https://images.unsplash.com/photo-1627920769842-6887c6df0489?auto=format&fit=crop&q=80&w=500",
    type: "Phân bón lá"
  },
  {
    id: 3,
    name: "Insect Killer 200EC",
    category: "Sầu riêng",
    image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=500",
    type: "Thuốc trừ sâu"
  },
  {
    id: 4,
    name: "Amino Acid Plus - Bung đọt",
    category: "Sầu riêng",
    image: "https://images.unsplash.com/photo-1615485925694-a031e78b4fac?auto=format&fit=crop&q=80&w=500",
    tag: "Hot",
    tagColor: "bg-orange-500",
    type: "Dinh dưỡng bổ sung"
  }
];

export const riceProducts: Product[] = [
  {
    id: 5,
    name: "Sạch Cỏ 300EC",
    category: "Lúa",
    image: "https://images.unsplash.com/photo-1536617621216-292150153f5a?auto=format&fit=crop&q=80&w=500",
    type: "Trừ cỏ"
  },
  {
    id: 6,
    name: "Rầy Nâu Chết Sạch",
    category: "Lúa",
    image: "https://images.unsplash.com/photo-1595123550441-d377e017de6a?auto=format&fit=crop&q=80&w=500",
    type: "Trừ rầy"
  },
  {
    id: 7,
    name: "Vô Gạo Cực Nhanh",
    category: "Lúa",
    image: "https://images.unsplash.com/photo-1530507629858-e4976987d460?auto=format&fit=crop&q=80&w=500",
    type: "Dưỡng hạt"
  },
  {
    id: 8,
    name: "Humic Root",
    category: "Lúa",
    image: "https://images.unsplash.com/photo-1627920769842-6887c6df0489?auto=format&fit=crop&q=80&w=500",
    type: "Kích rễ"
  }
];

export const otherProducts: Product[] = [
  {
    id: 9,
    name: "Vegetable Shield 500SC",
    category: "Rau màu",
    image: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&q=80&w=500",
    tag: "Mới",
    tagColor: "bg-green-500",
    type: "Thuốc trừ bệnh"
  },
  {
    id: 10,
    name: "Siêu Ra Rễ Cực Mạnh",
    category: "Cây ăn trái",
    image: "https://images.unsplash.com/photo-1615485925694-a031e78b4fac?auto=format&fit=crop&q=80&w=500",
    type: "Phân bón lá"
  },
  {
    id: 11,
    name: "Sâu Tơ Chết Sạch",
    category: "Rau màu",
    image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=500",
    type: "Thuốc trừ sâu"
  },
  {
    id: 12,
    name: "Amino Rong Biển",
    category: "Cây ăn trái",
    image: "https://images.unsplash.com/photo-1595123550441-d377e017de6a?auto=format&fit=crop&q=80&w=500",
    tag: "Hot",
    tagColor: "bg-orange-500",
    type: "Dinh dưỡng bổ sung"
  }
];

export const navLinks = [
  { name: "Trang chủ", href: "/", active: true },
  { name: "Giới thiệu", href: "/about" },
  { name: "Sản phẩm", href: "#" },
  { name: "Tin tức", href: "#" },
  { name: "Liên hệ", href: "#" },
];

export const categories: CategoryItem[] = [
  { name: "Tất cả sản phẩm", subtitle: "Xem toàn bộ danh mục", icon: Sprout },
  { name: "Sản phẩm cho Sầu riêng", subtitle: "Dinh dưỡng chuyên biệt", icon: Leaf },
  { name: "Sản phẩm cho Lúa", subtitle: "Năng suất vượt trội", icon: Wheat },
  { name: "Sản phẩm cho Cây trồng khác", subtitle: "Giải pháp đa dạng", icon: Flower },
];

export const news = [
  {
    id: 1,
    title: "Cập nhật giá sầu riêng hôm nay: Tiếp tục tăng cao",
    date: "12/10/2023",
    category: "Thị trường",
    image: "https://images.unsplash.com/photo-1595123550441-d377e017de6a?auto=format&fit=crop&q=80&w=500",
    excerpt: "Giá sầu riêng tại các tỉnh miền Tây và Tây Nguyên đang có xu hướng tăng do nhu cầu xuất khẩu sang thị trường Trung Quốc..."
  },
  {
    id: 2,
    title: "Quy trình bón phân cho lúa Đông Xuân đạt năng suất cao",
    date: "10/10/2023",
    category: "Kỹ thuật",
    image: "https://images.unsplash.com/photo-1536617621216-292150153f5a?auto=format&fit=crop&q=80&w=500",
    excerpt: "Vụ lúa Đông Xuân là vụ chính trong năm, việc bón phân cân đối và đúng thời điểm quyết định rất lớn đến năng suất cuối vụ..."
  },
  {
    id: 3,
    title: "Nam Viet tổ chức hội thảo đầu bờ tại Tiền Giang",
    date: "05/10/2023",
    category: "Sự kiện",
    image: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&q=80&w=500",
    excerpt: "Hơn 200 bà con nông dân đã tham dự hội thảo giới thiệu bộ sản phẩm mới chuyên dùng cho cây ăn trái của Nam Viet..."
  }
];