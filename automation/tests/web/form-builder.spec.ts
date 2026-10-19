import { test, expect } from '@playwright/test';
import { signInToOffice } from '../../helpers/web-session';
import { users } from '../../helpers/test-data';
import { FormBuilderPage } from '../../pages/form-builder.page';

test.describe('Flow 1 - Form Builder', () => {
  test.beforeEach(async ({ page }) => {
    await signInToOffice(page, users.adminA);
  });

  test(
    'EI-A-009 Form Builder UI blocks the 51st Field and the 5th Radio option',
    { tag: '@P1' },
    async ({ page }) => {
      const builder = new FormBuilderPage(page);
      const suffix = Date.now();

      await test.step('1. Create a Form and add 50 Fields', async () => {
        await builder.createForm(`EI-LIMIT-${suffix}`);
        for (let i = 0; i < 50; i++) {
          await builder.addField('Text');
        }

        await expect(builder.fields).toHaveCount(50);
      });

      await test.step('2. Try to add another Field', async () => {
        // Either outcome is acceptable: the button is disabled, or adding shows the limit message.
        if (await builder.addFieldButton.isEnabled()) {
          await builder.addFieldButton.click();
          await expect(page.getByText('Maximum 50 Fields')).toBeVisible();
        }

        await expect(builder.fields).toHaveCount(50);
      });

      const radio =
        await test.step('3. Create another Form and add a Radio Field with 4 options', async () => {
          await builder.createForm(`EI-RADIO-${suffix}`);
          const field = await builder.addField('Radio');
          for (const label of ['Good', 'Fair', 'Poor', 'Broken']) {
            await builder.addOption(field, label);
          }

          await expect(builder.options(field)).toHaveCount(4);
          return field;
        });

      await test.step('4. Try to add a 5th option', async () => {
        if (await builder.addOptionButton(radio).isEnabled()) {
          await builder.addOptionButton(radio).click();
          await expect(page.getByText('Maximum 4 options')).toBeVisible();
        }

        await expect(builder.options(radio)).toHaveCount(4);
      });
    },
  );
});
