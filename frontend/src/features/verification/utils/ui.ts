import { DeliveryPriority, OrderStatus } from '../types/OrderTypes';

export function getPriorityBadgeColor(pr: DeliveryPriority | undefined): string {
  switch (pr) {
    case DeliveryPriority.Low:
      return 'bg-blue-100 text-blue-800';
    case DeliveryPriority.Medium:
      return 'bg-amber-100 text-amber-800';
    case DeliveryPriority.High:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getOrderStatusBadgeColor(st: OrderStatus | undefined): string {
  switch (st) {
    case OrderStatus.Pending:
      return 'bg-yellow-100 text-yellow-800';
    case OrderStatus.Issued:
      return 'bg-blue-100 text-blue-800';
    case OrderStatus.Confirmed:
      return 'bg-indigo-100 text-indigo-800';
    case OrderStatus.InPreparation:
      return 'bg-orange-100 text-orange-800';
    case OrderStatus.Prepared:
      return 'bg-purple-100 text-purple-800';
    case OrderStatus.SentToBilling:
      return 'bg-amber-100 text-amber-800';
    case OrderStatus.Invoiced:
      return 'bg-green-100 text-green-800';
    case OrderStatus.Verified:
      return 'bg-emerald-100 text-emerald-800';
    case OrderStatus.OnTheWay:
      return 'bg-cyan-100 text-cyan-800';
    case OrderStatus.Delivered:
      return 'bg-green-100 text-green-800';
    case OrderStatus.Canceled:
      return 'bg-red-100 text-red-800';
    case OrderStatus.PendingResolution:
      return 'bg-yellow-100 text-yellow-800';
    case OrderStatus.ReIssued:
      return 'bg-blue-100 text-blue-800';
    case OrderStatus.PendingReissued:
      return 'bg-yellow-100 text-yellow-800';
    case OrderStatus.PendingVerification:
      return 'bg-orange-100 text-orange-800';
    case OrderStatus.AssignedDelivery:
      return 'bg-purple-100 text-purple-800';
    case OrderStatus.PendingCashVerification:
      return 'bg-yellow-100 text-yellow-800';
    case OrderStatus.CashVerified:
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}


