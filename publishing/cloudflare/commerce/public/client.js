export async function api(path, data) {
  const response = await fetch('/api/' + path, {credentials:'same-origin', cache:'no-store',
    signal:AbortSignal.timeout(10000), ...(data !== undefined ? {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)} : {})});
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Accounts are not ready yet. You can still use the lessons.');
  return result;
}
export const session = api('session').catch(() => ({user:null,membership:{pro:false,owner:false},config:{accountsReady:false,adsEnabled:false}}));
export const money = value => Number.isFinite(value) ? new Intl.NumberFormat('en-PK',{style:'currency',currency:'PKR',minimumFractionDigits:2,maximumFractionDigits:2}).format(value/100) : 'Not available yet';
export function message(text) { const area=document.querySelector('#message'); if (area) {area.textContent=text; area.hidden=false;} }
export function textCell(row,text) { const cell=document.createElement('td'); cell.textContent=text; row.append(cell); return cell; }
