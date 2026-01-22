using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Domain.Helper
{
    public enum SatisfactionLevel
    {
        Mala,
        Regular,
        Media,
        Alta
    }

    public static class SatisfactionClassifier
    {
        public static SatisfactionLevel FromScore(int score)
        {
            return score switch
            {
                <= 2 => SatisfactionLevel.Mala,
                3 => SatisfactionLevel.Regular,
                4 => SatisfactionLevel.Media,
                5 => SatisfactionLevel.Alta,
                _ => throw new ArgumentOutOfRangeException(nameof(score))
            };
        }

    }
}
