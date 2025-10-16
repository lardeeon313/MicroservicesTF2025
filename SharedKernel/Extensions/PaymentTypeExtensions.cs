using SalesService.Domain.Enums;
using SharedKernel.IntegrationEvents.PaymentTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedKernel.Extensions
{
    public static class PaymentTypeExtensions
    {
        public static PaymentTypeDto? ToDto(this PaymentType? paymentType)
        {
            if (!paymentType.HasValue) return null;

            return paymentType.Value switch
            {
                PaymentType.Transfer => PaymentTypeDto.Transfer,
                PaymentType.Credit_Card => PaymentTypeDto.Credit_Card,
                PaymentType.Debit_Card => PaymentTypeDto.Debit_Card,
                PaymentType.Cash => PaymentTypeDto.Cash,
                PaymentType.Current_Account => PaymentTypeDto.Current_Account,
                PaymentType.Check => PaymentTypeDto.Check,
                PaymentType.Promissory_Note => PaymentTypeDto.Promissory_Note,
                _ => null
            };
        }
    }
}
