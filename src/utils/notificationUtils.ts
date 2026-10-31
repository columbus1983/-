import { AppNotification, Producer, Product } from '../types';

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'favorite_producer_harvest',
    producerId: 'prod-1',
    producerName: 'عمّ سالم العكاري',
    farmName: 'سانية وادي الرمل',
    producerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    productId: 'prod-p1',
    productName: 'قفة الخير الأسبوعية خضار وفواكه مشكلة (6 كغ)',
    productImage: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80',
    priceDirect: 7.800,
    unit: 'القفة الكاملة 6 كغ',
    message: 'فلاّحك المفضل أضاف صابة موسمية جديدة: قفة خضار وفواكه مقطوعة فجر اليوم بسعر 7.800 د.ت فقط!',
    timestamp: 'منذ 15 دقيقة',
    isRead: false,
    governorate: 'نابل',
  },
  {
    id: 'notif-2',
    type: 'favorite_producer_harvest',
    producerId: 'prod-2',
    producerName: 'خالتي فاطمة السعيدي',
    farmName: 'ضيعة وادي الزيتون',
    producerAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=250&q=80',
    productId: 'prod-p3',
    productName: 'زيت زيتون تونسي بكر ممتاز عصرة أولى على البارد',
    productImage: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    priceDirect: 68.000,
    unit: 'بيدون 5 لتر',
    message: 'خالتي فاطمة التي تابعتها أطلقت عصرة الزيتون الجديدة مباشرة من المعصرة في سيدي بوزيد.',
    timestamp: 'منذ ساعتين',
    isRead: false,
    governorate: 'سيدي بوزيد',
  },
  {
    id: 'notif-3',
    type: 'favorite_producer_harvest',
    producerId: 'prod-1',
    producerName: 'عمّ سالم العكاري',
    farmName: 'سانية وادي الرمل',
    producerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    productId: 'prod-p4',
    productName: 'صندوق 5 كغ برتقال مالطي نابل للعصير والأكل',
    productImage: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=800&q=80',
    priceDirect: 6.500,
    unit: 'صندوق 5 كغ',
    message: 'صابة جديدة: برتقال مالطي نابل معصور وسكر، جني الأمس متاح للحجز المباشر.',
    timestamp: 'منذ 5 ساعات',
    isRead: true,
    governorate: 'نابل',
  }
];

export function createHarvestNotification(
  producer: Producer,
  product: Product
): AppNotification {
  return {
    id: `notif-${Date.now()}`,
    type: 'favorite_producer_harvest',
    producerId: producer.id,
    producerName: producer.name,
    farmName: producer.farmName,
    producerAvatar: producer.avatar,
    productId: product.id,
    productName: product.name,
    productImage: product.image,
    priceDirect: product.priceDirect,
    unit: product.unit,
    message: `فلاّحك المفضل ${producer.name} أضاف صابة موسمية جديدة: "${product.name}" بسعر ${product.priceDirect.toFixed(3)} د.ت.`,
    timestamp: 'الآن',
    isRead: false,
    governorate: producer.governorate,
  };
}

export function markNotificationAsRead(
  notifications: AppNotification[],
  id: string
): AppNotification[] {
  return notifications.map((n) =>
    n.id === id ? { ...n, isRead: true } : n
  );
}

export function markAllNotificationsAsRead(
  notifications: AppNotification[]
): AppNotification[] {
  return notifications.map((n) => ({ ...n, isRead: true }));
}

export function countUnreadNotifications(
  notifications: AppNotification[]
): number {
  return notifications.filter((n) => !n.isRead).length;
}
