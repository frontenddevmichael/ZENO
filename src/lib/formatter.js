export function formatPrice(amountInKobo) {
    const naira = amountInKobo / 100
    return '₦' + naira.toLocaleString('en-NG')
}

