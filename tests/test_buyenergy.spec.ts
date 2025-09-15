import { test, expect } from '@playwright/test';

const baseURL = 'https://qacandidatetest.ensek.io/'

test.describe('Test Buy energy', () => {

    test('Verify reset energy quantities', async ({ request }) => {
        const endpoint_reset = baseURL + '/ENSEK/reset'
        // Send put request
        const response = await request.post(endpoint_reset);
//given no payload 
//headers 
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        // read response into a constant
        const body = await response.json();
        console.log()
        expect(body.message).toBe('Success')

    });

    test('Verify invalid fuel id to return bad request', async ({ request }) => {
        const endpoint_invalid_id = baseURL + '/ENSEK/buy/455/10'
        // Send put request
        const response = await request.put(endpoint_invalid_id);

        expect(response.status()).toBe(400);
        // read response into a constant
        const body = await response.json();

        // Parse response JSON
        const data = await response.json();

        expect(body.message).toBe('Bad request')

    });

    test('Verify invalid quantity to return not found', async ({ request }) => {
        const endpoint_invalid_quantity = baseURL + '/ENSEK/buy/3/ndn'
        // Send put request
        const response = await request.put(endpoint_invalid_quantity);

        expect(response.status()).toBe(404);
        // read response into a constant
        const body = await response.json();
        expect(body.message).toBe('Not Found')

    });

    test('verify gas purchase confirmation show correct quanity and price', async ({ request }) => {
        const endpoint_buy_gas = baseURL + '/ENSEK/buy/1/10'
        // Send put request
        const response = await request.put(endpoint_buy_gas);
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        // Parse response JSON
        const data = await response.json();
        expect(data.message).toContain('You have purchased 10 m³ at a cost of 3.4')

    });

    test('verify electric purchase confirmation show correct quanity and price', async ({ request }) => {
        const endpoint_buy_electric = baseURL + '/ENSEK/buy/3/10'
        // Send put request
        const response = await request.put(endpoint_buy_electric);
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        // Parse response JSON
        const data = await response.json();
        expect(data).toContain('You have purchased 10 kWh at a cost of 4.7');

    });

    test('verify oil purchase confirmation show correct quanity and price', async ({ request }) => {
        const endpoint_buy_oil = baseURL + '/ENSEK/buy/4/10'
        // Send put request
        const response = await request.put(endpoint_buy_oil);
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        // Parse response JSON
        const data = await response.json();
        expect(data).toContain('You have purchased 10 Litres at a cost of');

    });
});