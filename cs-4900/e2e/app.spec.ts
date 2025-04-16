import { test } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Songs' }).click();
  await page.getByRole('heading', { name: 'All songs' }).click();
  await page.getByRole('img', { name: 'Test Song f' }).click();
  await page.getByText('Test Song f').click();
});