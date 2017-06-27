import { SimpleNoteAppPage } from './app.po';

describe('simple-note-app App', () => {
  let page: SimpleNoteAppPage;

  beforeEach(() => {
    page = new SimpleNoteAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
