import { Page } from "puppeteer";

import { clickOnButton } from "../helpers";

// TODO: thing about renaming this method?
export const approve = (page: Page) => async (): Promise<void> => {
  await page.bringToFront();
  await page.reload();

  // TODO: step 1 of connect chose account to connect?
  await clickOnButton(page, "Next");
  await clickOnButton(page, "Connect");
};
