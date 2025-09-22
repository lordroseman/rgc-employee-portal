export function useCurrencyFormat(
  locale = 'en-US',
  currency = 'USD'
) {
    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })

    const format = (value: number | string | null | undefined) => {
        const n =
        typeof value === 'string' ? Number(value) :
        value ?? 0
        return formatter.format(Number.isFinite(n as number) ? (n as number) : 0)
    }

    return { format }
}
