import { CustomerResponse } from "../../types/CustomerTypes";

interface Props {
  customer: CustomerResponse;
}

const CustomerDetail = ({ customer }: Props) => {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Detalle del Cliente
        </h2>

        <div className="mt-10 space-y-6">
          <div className="bg-white p-6 rounded-md shadow-sm">
            <p className="text-sm text-gray-600 mb-1 font-semibold">Nombre</p>
            <p className="text-base text-gray-900">
              {customer.firstName} {customer.lastName}
            </p>
          </div>

          <div className="bg-white p-6 rounded-md shadow-sm">
            <p className="text-sm text-gray-600 mb-1 font-semibold">Email</p>
            <p className="text-base text-gray-900">{customer.email}</p>
          </div>

          <div className="bg-white p-6 rounded-md shadow-sm">
            <p className="text-sm text-gray-600 mb-1 font-semibold">Teléfono</p>
            <p className="text-base text-gray-900">{customer.phoneNumber}</p>
          </div>

          <div className="bg-white p-6 rounded-md shadow-sm">
            <p className="text-sm text-gray-600 mb-1 font-semibold">Dirección</p>
            <p className="text-base text-gray-900">{customer.address}</p>
          </div>
        </div>
      </div>

        

    </div>
  );
};

export default CustomerDetail;
