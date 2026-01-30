export const reviewCycleLocators = {
  reviewsNav: (page) => page.getByRole('link', { name: 'Reviews', exact: true }),

  createNewCycleBtn: (page) =>
    page.getByRole('button', { name: 'Create New Cycle' }),

  createPerformanceReviewBtn: (page) =>
    page.locator('.ant-modal-body')
      .getByRole('button', { name: 'Create Performance Review' }),

  titleInput: (page) => page.locator('#review-name'),

  saveAndContinueBtn: (page) =>
    page.getByRole('button', { name: 'Save & Continue' }),

  saveAsDraftBtn: (page) =>
    page.getByRole('button', { name: 'Save as Draft' }),

  createFormBtn: (page) =>
    page.getByRole('button', { name: 'Create Form' }).first(),

  createFromScratchBtn: (page) =>
    page.getByRole('button', { name: 'Create From Scratch' }),

  addQuestionBtn: (page, index = 0) =>
    page.getByRole('button', { name: 'Add' }).nth(index),

  addReviewersBtn: (page) =>
    page.getByRole('button', { name: 'Add Reviewers' }),

  verifyPageText: (page) =>
    page.getByText(
      'You are good to go. Just review your choices and you are good to go.'
    ),

  // Step Nav
  stepNav: (page, stepNumber) => page.getByText(stepNumber.toString()),

  // Goals
  goalSwitch: (page) => page.getByRole('switch').nth(4),
  goalCycleDropdown: (page) =>
    page.locator('div').filter({ hasText: /^Select Goal Cycles$/ }),
  selectAllGoalCycles: (page) =>
    page.getByRole('menuitem', { name: 'Select All Goal Cycles' }),
  allCyclesSelectedHelper: (page) =>
    page.locator('div').filter({ hasText: /^All Cycles Selected$/ }),

  // Forms
  editFormBtn: (page) => page.getByRole('button', { name: 'Edit Form' }).first(),
  formQuestionCard: (page) => page.locator('.draggable-question-card'),
  formBuilderAddBtn: (page) => page.locator('button:has-text("Add")'),

  // Drafts
  draftListItems: (page) => page.locator('.flex.flex-col.flex-grow-1'),
  draftTitle: (title, page) => page.getByText(title),

  // Misc
  closeModalBtn: (page) => page.locator('.review-creation-form-layout .close-btn').first(),
  confirmDiscardBtn: (page) => page.getByRole('button', { name: /(Discard|Leave|Yes|OK|Confirm)/i }),
  createReviewCycleBtn: (page) =>
    page.getByRole('button', { name: 'Create Review Cycle' }),
  phasesTab: (page) => page.locator('span').filter({ hasText: 'Phases' }),
  statusNotStarted: (page) => page.getByText('not started', { exact: true })
};
