import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('Check API version button', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.click('#get-api-version');

  const response = await page.request.get(`${process.env.VITE_API_DEV_URL}/api-version`);
  expect(response.status()).toBe(200);
});