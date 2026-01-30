import { expect } from '@playwright/test';
import { reviewCycleLocators as loc } from '../locators/app.locators';

export class ReviewCycleFlow {
  constructor(page) {
    this.page = page;
  }

  async navigateToReviews() {
    try {
      await expect(loc.reviewsNav(this.page)).toBeVisible({ timeout: 10000 });
      await loc.reviewsNav(this.page).click();
      await this.page.waitForTimeout(1500);
    } catch (error) {
      throw new Error(`Failed to navigate to reviews: ${error.message}`);
    }
  }

  async startNewCycle() {
    await expect(loc.createNewCycleBtn(this.page)).toBeVisible({ timeout: 10000 });
    await loc.createNewCycleBtn(this.page).click();
    await expect(loc.createPerformanceReviewBtn(this.page)).toBeVisible({ timeout: 5000 });
    await loc.createPerformanceReviewBtn(this.page).click();
    await this.page.waitForTimeout(1000); // Matched reference wait
  }

  async fillTitle(title) {
    await expect(loc.titleInput(this.page)).toBeVisible();
    await loc.titleInput(this.page).fill(title);
    await this.page.waitForTimeout(800);
    await loc.saveAndContinueBtn(this.page).click();
    await this.page.waitForTimeout(1000);
  }

  async configureReviews({ self = true, peer = true, goals = false } = {}) {
    await expect(this.page.getByText('Configure steps of this review cycle')).toBeVisible();
    await this.page.waitForTimeout(1000);

    if (self) {
      await this.page.getByRole('switch').first().click();
      await this.page.waitForTimeout(800);
    }

    if (peer) {
      await this.page.getByRole('switch').nth(1).click();
      await this.page.waitForTimeout(800);
    }

    if (goals) {
      await this.configureGoals();
    }

    await loc.saveAndContinueBtn(this.page).scrollIntoViewIfNeeded();
    await loc.saveAndContinueBtn(this.page).click();
    await this.page.waitForTimeout(1200);
  }

  async configureGoals() {
    // Switch index 4 for goals as per reference
    await this.page.getByRole('switch').nth(4).click();
    await this.page.waitForTimeout(800);

    await loc.goalCycleDropdown(this.page).click();
    await this.page.waitForTimeout(500);

    await loc.selectAllGoalCycles(this.page).click();
    await this.page.waitForTimeout(500);

    await loc.allCyclesSelectedHelper(this.page).click();
    await this.page.waitForTimeout(800);
  }

  async createSelfReviewForm() {
    await expect(this.page.getByText('Create customizable review forms with relevant questions')).toBeVisible();
    await this.page.waitForTimeout(1000);

    console.log('Creating Self Review Form');
    await loc.createFormBtn(this.page).click();
    await this.page.waitForTimeout(800);

    await loc.createFromScratchBtn(this.page).click();
    await this.page.waitForTimeout(800);

    await loc.formBuilderAddBtn(this.page).first().click();
    await this.page.waitForTimeout(500);

    await loc.formBuilderAddBtn(this.page).nth(5).click(); // As per reference
    await this.page.waitForTimeout(500);

    await this.page.locator('div:nth-child(10) > .flex.justify-between > .ant-btn').click();
    await this.page.waitForTimeout(800);

    await loc.saveAndContinueBtn(this.page).scrollIntoViewIfNeeded();
    await loc.saveAndContinueBtn(this.page).click();
    await this.page.waitForTimeout(1200);
  }

  async createPeerReviewForm() {
    console.log('Creating Peer Review Form');
    await loc.createFormBtn(this.page).click();
    await this.page.waitForTimeout(800);

    await loc.createFromScratchBtn(this.page).click();
    await this.page.waitForTimeout(800);

    await loc.formBuilderAddBtn(this.page).first().click();
    await this.page.waitForTimeout(500);

    await loc.formBuilderAddBtn(this.page).nth(1).click();
    await this.page.waitForTimeout(500);

    await loc.saveAndContinueBtn(this.page).scrollIntoViewIfNeeded();
    await loc.saveAndContinueBtn(this.page).click();
    await this.page.waitForTimeout(2000);

    await loc.saveAndContinueBtn(this.page).click();
  }

  async addReviewees(count = 4) {
    await expect(this.page.getByText('Select reviewees who will be a part of this review.')).toBeVisible();
    await this.page.waitForTimeout(800);

    for (let i = 0; i < count; i++) {
      await this.page.getByRole('button', { name: 'plus' }).nth(i).click();
      await this.page.waitForTimeout(300);
    }

    await this.page.locator('div:nth-child(7) > .grid-row > .add-button-wrapper > div > .ant-btn').click();
    // Reference has 3000ms wait in one TC, but here likely fine? Reference TC08 has 3000ms wait after this click.
    // Spec TC06/07 doesn't seem to mention wait here but let's be safe.

    await loc.saveAndContinueBtn(this.page).scrollIntoViewIfNeeded();
    await loc.saveAndContinueBtn(this.page).click();
  }

  async addReviewerMapping() {
    await this.page.waitForTimeout(1000);
    await loc.addReviewersBtn(this.page).click();
    await this.page.waitForTimeout(800); // Fixed missing pause

    await this.page.locator('div')
      .filter({ hasText: /^Search Reviewer$/ })
      .nth(2)
      .click();
    await this.page.waitForTimeout(500);

    const reviewerElements = await this.page.$$('.fw-500.fs-smedium.ellipsis');
    await reviewerElements[0].click();

    await this.page.locator('div')
      .filter({ hasText: /^Search Reviewee$/ })
      .nth(2)
      .click();
    await this.page.waitForTimeout(500);

    const revieweeElements = await this.page.$$('.fw-500.fs-smedium.ellipsis');
    await revieweeElements[10].click();

    await this.page.getByRole('button', { name: 'Add', exact: true }).click();
    await this.page.waitForTimeout(500);

    await loc.saveAndContinueBtn(this.page).click();
    await this.page.waitForTimeout(1500);
  }

  async saveAsDraft(title) {
    await expect(loc.saveAsDraftBtn(this.page)).toBeVisible();
    await loc.saveAsDraftBtn(this.page).click();
    await this.page.waitForTimeout(1500);
    if (title) {
      await expect(loc.draftTitle(title, this.page).first()).toBeVisible();
    }
  }

  async goToStep(stepNumber) {
    await loc.stepNav(this.page, stepNumber).click();
    if (stepNumber === 6) {
      await expect(loc.verifyPageText(this.page)).toBeVisible();
    }
    await this.page.waitForTimeout(1000);
  }

  async goToVerifyStep() {
    await this.goToStep(6);
  }

  async openDraft(cycleName) {
    if (cycleName) {
      await loc.draftTitle(cycleName, this.page).first().click();
    } else {
      await loc.draftListItems(this.page).first().click();
    }
    await this.page.waitForTimeout(1500);
  }

  async verifyFormHasQuestions() {
    await this.page.waitForSelector('.draggable-question-card', { state: 'attached', timeout: 10000 });
    const questions = await loc.formQuestionCard(this.page).count();
    expect(questions).toBeGreaterThan(0);
  }

  async editForm() {
    await loc.editFormBtn(this.page).click();
    await this.page.waitForTimeout(1000);
  }

  async createReviewCycleExplicitly() {
    // Matched reference TC06/07
    await loc.createReviewCycleBtn(this.page).click();
    await this.page.waitForTimeout(1500);
  }

  async verifyPhaseStatus(statusText) {
    await loc.phasesTab(this.page).click();
    await this.page.waitForTimeout(1000);
    await expect(this.page.getByText(statusText, { exact: true })).toBeVisible();
  }

  async exitCreationFlow() {
    // Matched reference TC08 logic
    // Reference used: await page.getByRole('button').first().click();
    // Using specific locator to be safe but same logic (click & wait)
    await loc.closeModalBtn(this.page).click();
    await this.page.waitForTimeout(1500);
  }
}
