import md5 from 'md5';
import { API_URL } from '../const/defaults';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const currencyFormat = (value) => {
  const noSpace = formatter.format(value);
  return noSpace.replace(/([\d,.]+)$/, ' $1');
};

export const createInvoiceUrl = (id) => {
  const hash = md5(String(id));
  const link = new URL(`invoices/${id}/${hash}`, API_URL).href;
  return link;
};
