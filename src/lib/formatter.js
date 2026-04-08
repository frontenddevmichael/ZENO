export function formatPrice(amountInKobo) {
    const naira = amountInKobo /1
    return '₦' + naira.toLocaleString('en-NG')
}

