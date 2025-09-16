import { test, expect } from '@playwright/test';
//** below variables can be declared in .env file and using .dot we can import */
const baseURL = 'https://qacandidatetest.ensek.io/'
const orders_endpoint = baseURL + 'ENSEK/orders'

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
    //** Please note : below tests may have repeated code line 
    // which can return as reusable components in a framework  */
// purchase gas energy
    test.only('verify gas purchase confirmation show correct quanity and price', async ({ request }) => {
        const endpoint_buy_gas = baseURL + '/ENSEK/buy/1/10'
        // Send put request
        const response = await request.put(endpoint_buy_gas);
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        // Parse response JSON
        const data = await response.json();
         //** capture the order_id once order is placed successfully */  this can be written as re-usable component
        const message: string = data.message
        const match = message.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
        //extract order_id 
        const uuid = match![0]
        //** Get orders  */
        const orders_response = await request.get(orders_endpoint);
        //parse response JSON
        const orders_data = await orders_response.json();
        //find new order placed and validate it's corresponding fuel type is correct
        const new_order = orders_data.find((order: any) => (order.id || order.Id) === uuid);

        // Assert the order exists
        expect(new_order).toBeTruthy();
        // Extract fuel type
        const fuel = new_order.fuel;
        //validate fuel type in the order confirmation
        expect(fuel).toBe('gas');

    });
    //purchase electricity
    test.only('verify electric purchase confirmation show correct quanity and price', async ({ request }) => {
        const endpoint_buy_electric = baseURL + '/ENSEK/buy/3/10'
        // Send put request
        const response = await request.put(endpoint_buy_electric);
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        // Parse response JSON
        const data = await response.json();
         //** capture the order_id once order is placed successfully */  this can be written as re-usable component
        const message: string = data.message
        const match = message.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
        //extract order_id 
        const uuid = match![0]
        //** Get orders  */
        const orders_response = await request.get(orders_endpoint);
        //parse response JSON
        const orders_data = await orders_response.json();
        //find new order placed and validate it's corresponding fuel type is correct
        const new_order = orders_data.find((order: any) => (order.id || order.Id) === uuid);

        // Assert the order exists
        expect(new_order).toBeTruthy();
        // Extract fuel type
        const fuel = new_order.fuel;
        //validate fuel type in the order confirmation
        expect(fuel).toBe('Elec');
        //

    });

    //purchase oil
    test.only('verify oil purchase confirmation show correct quanity and price', async ({ request }) => {
        const endpoint_buy_oil = baseURL + '/ENSEK/buy/4/10'
        //** place the Oil purchase order */
        
        // Send put request
        const response = await request.put(endpoint_buy_oil);
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        // Parse response JSON
        const data = await response.json();
        //console.log(data)

        //** capture the order_id once order is placed successfully */  this can be written as re-usable component
        const message: string = data.message
        const match = message.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
        //extract order_id 
        const uuid = match![0]
        //** Get orders  */
        const orders_response = await request.get(orders_endpoint);
        //parse response JSON
        const orders_data = await orders_response.json();
        //find new order placed and validate it's corresponding fuel type is correct
        const new_order = orders_data.find((order: any) => (order.id || order.Id) === uuid);

        // Assert the order exists
        expect(new_order).toBeTruthy();
        // Extract fuel type
        const fuel = new_order.fuel;
        //validate fuel type in the order confirmation
        expect(fuel).toBe('Oil');

    });

    //validate bad request for non existing fuel id
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
    //validate non-numeric quantity - verify request not found
    test('Verify invalid quantity to return not found', async ({ request }) => {
        const endpoint_invalid_quantity = baseURL + '/ENSEK/buy/3/ndn'
        // Send put request
        const response = await request.put(endpoint_invalid_quantity);

        expect(response.status()).toBe(404);
        // read response into a constant
        const body = await response.json();
        expect(body.message).toBe('Not Found')

    });
});