import { FieldProps } from "formik";
import { Combobox } from "@headlessui/react" 
import { useState, useEffect } from "react";
import { CustomerResponse } from "../../types/CustomerTypes";

type Props = FieldProps & {
  customers: CustomerResponse[];
};

const CustomerSearchCombobox = ({ field, form, customers }: Props) => {
  const [query, setQuery] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState(customers);

  useEffect(() => {
    setFilteredCustomers(
      customers.filter((c) =>
        `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, customers]);

  const selectedCustomer = customers.find((c) => c.id === field.value) ?? null;

  return (
    <div className="w-full">
      <Combobox
        value={selectedCustomer}
        onChange={(val) => form.setFieldValue(field.name, val?.id)}
      >
        <Combobox.Input
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-red-200"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(customer?: CustomerResponse) =>
            customer ? `${customer.firstName} ${customer.lastName}` : ""
          }
          placeholder="Buscar cliente por nombre"
        />
        <Combobox.Options className="z-10 bg-white shadow-lg rounded-md mt-1 max-h-60 overflow-auto border border-gray-200">
          {filteredCustomers.length === 0 ? (
            <div className="px-4 py-2 text-gray-500">Sin resultados</div>
          ) : (
            filteredCustomers.map((customer) => (
              <Combobox.Option
                key={customer.id}
                value={customer}
                className={({ active }) =>
                  `cursor-pointer px-4 py-2 ${
                    active ? "bg-red-100 text-red-800" : "text-gray-900"
                  }`
                }
              >
                {customer.firstName} {customer.lastName}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Combobox>
      {form.touched[field.name] && form.errors[field.name] && (
        <div className="text-red-700 text-sm pt-1">{String(form.errors[field.name])}</div>
      )}
    </div>
  );
};

export default CustomerSearchCombobox;
