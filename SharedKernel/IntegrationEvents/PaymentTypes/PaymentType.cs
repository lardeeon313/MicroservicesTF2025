using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedKernel.IntegrationEvents.PaymentTypes
{
    public enum PaymentTypeDto
    {
        Transfer,
        Credit_Card,
        Debit_Card,
        Cash,
        Current_Account,
        Check,
        Promissory_Note,
    }
}
