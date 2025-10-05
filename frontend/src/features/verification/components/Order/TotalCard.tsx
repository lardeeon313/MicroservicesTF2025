// import React from 'react';

// interface TotalCardProps {
//   label: string;
//   amount: number;
//   currency?: string;
//   size?: 'small' | 'medium' | 'large'; // Tamaño configurable
// }

// const sizeStyles = {
//   small: {
//     padding: 'p-2',
//     label: 'text-sm',
//     amount: 'text-xl',
//   },
//   medium: {
//     padding: 'p-4',
//     label: 'text-xl',
//     amount: 'text-3xl',
//   },
//   large: {
//     padding: 'p-6',
//     label: 'text-2xl',
//     amount: 'text-4xl',
//   },
// };

// const TotalCard: React.FC<TotalCardProps> = ({
//   label,
//   amount,
//   currency = '$',
//   size = 'medium',
// }) => {
//   const styles = sizeStyles[size];

//   return (
//     <div
//       className={`bg-white rounded-xl shadow-lg ${styles.padding} transition-transform hover:scale-101 mb-4`}
//     >
//       <div className="flex justify-between items-center">
//         <span className={`font-semibold text-gray-700 ${styles.label}`}>
//           {label}
//         </span>
//         <span className={`font-bold text-red-600 ${styles.amount}`}>
//           {currency}{amount.toFixed(2)}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default TotalCard;
