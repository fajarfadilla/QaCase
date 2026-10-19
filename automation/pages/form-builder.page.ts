import type { Locator, Page } from '@playwright/test';

export type FieldType = 'Text' | 'Date Picker' | 'Select' | 'Radio' | 'Image Picker';

/** WeMineOffice Form Builder. Element names are assumed (AS-49). */
export class FormBuilderPage {
  readonly formCode: Locator;
  readonly addFieldButton: Locator;
  readonly fields: Locator;

  constructor(private readonly page: Page) {
    this.formCode = page.getByLabel('Form Code');
    this.addFieldButton = page.getByRole('button', { name: 'Add Field' });
    this.fields = page.getByRole('list', { name: 'Fields' }).getByRole('listitem');
  }

  async createForm(formCode: string): Promise<void> {
    await this.page.goto('/form-builder/new');
    await this.formCode.fill(formCode);
  }

  async addField(type: FieldType): Promise<Locator> {
    await this.addFieldButton.click();
    await this.page.getByRole('menuitem', { name: type }).click();
    return this.fields.last();
  }

  addOptionButton(field: Locator): Locator {
    return field.getByRole('button', { name: 'Add option' });
  }

  options(field: Locator): Locator {
    return field.getByRole('textbox', { name: /^Option/ });
  }

  async addOption(field: Locator, label: string): Promise<void> {
    await this.addOptionButton(field).click();
    await this.options(field).last().fill(label);
  }
}
