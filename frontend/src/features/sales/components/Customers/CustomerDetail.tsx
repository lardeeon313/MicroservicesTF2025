import { Link } from "react-router-dom";
import { CustomerResponse } from "../../types/CustomerTypes";

interface Props {
  customer: CustomerResponse;
}

const CustomerDetail = ({ customer }: Props) => {
  return (
    <div className="space-y-6 container mx-auto py-10 px-16 sm:max-w-6xl">
      <label className="block text-sm font-medium text-gray-900 mb-1">Nombre</label>
      <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
        {customer.firstName} {customer.lastName}
      </p>
          
      <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
      <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">{customer.email}</p>

      <label className="block text-sm font-medium text-gray-900 mb-1">Teléfono</label>
      <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">{customer.phoneNumber}</p>

      <label className="block text-sm font-medium text-gray-900 mb-1">Dirección</label>
      <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
        {customer.addresses && customer.addresses.length > 0
          ? `${customer.addresses[0].street} ${customer.addresses[0].number}${customer.addresses[0].apartment ? ', ' + customer.addresses[0].apartment : ''}, ${customer.addresses[0].city}, ${customer.addresses[0].province}, ${customer.addresses[0].country}`
          : "Sin dirección"}
      </p>

      <div className="mt-10">
        <Link 
          to={`/sales/customer/update/${customer.id}`}
          className="flex w-full justify-center items-center rounded-md bg-red-700 px-3 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-red-600 transition duration-150 disabled:opacity-50"
        >
          Editar Cliente
        </Link>
      </div>

    </div>

      
  );
};

export default CustomerDetail;
