import { test, expect } from '@playwright/test';
const baseURL = 'https://qacandidatetest.ensek.io/'
const get_orders = baseURL + 'ENSEK/orders'

test.only('list past orders', async ({ request }) => {

  const response = await request.get(get_orders);
  expect(response.status()).toBe(200);

  // Parse JSON
  const orders = await response.json();

  // Get today's date in UTC format (e.g., "15 Sep 2025")
  const today = new Date().toUTCString().split(' ').slice(1, 4).join(' ');

 // list all past date orders (not matching today's date)
  const pastOrders = orders.filter((order: any) => {
    const orderDate = new Date(order.time).toUTCString().split(' ').slice(1, 4).join(' ');
    return orderDate !== today;
  });
  console.log('Past Orders', pastOrders);
});