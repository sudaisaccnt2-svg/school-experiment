export function activeOffer(offer,stamp=Date.now()) {
  return Boolean(offer && offer.type!=='none' && (!offer.startsAt || offer.startsAt<=stamp) && (!offer.endsAt || offer.endsAt>stamp));
}
export function discountAmount(base,offer) {
  return offer?.type==='percent' ? Math.floor(base*offer.value/100) : offer?.type==='fixed' ? offer.value : 0;
}
export function tierPrice(tier,stamp=Date.now()) {
  const discount=activeOffer(tier.sale,stamp) ? discountAmount(tier.pricePaisa,tier.sale) : 0;
  return {baseAmountPaisa:tier.pricePaisa,discountPaisa:discount,amountPaisa:tier.pricePaisa-discount,
    discountLabel:discount ? (tier.sale.type==='percent' ? tier.sale.value+'% sale' : 'Sale price') : '',saleEndsAt:discount ? tier.sale.endsAt : null};
}
