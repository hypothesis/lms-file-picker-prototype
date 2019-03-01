import queryString from 'query-string';

/**
 * Manages an LMS authentication popup window.
 */
export default class AuthWindow {
  constructor({ authToken, lmsName }) {
    this._authToken = authToken;

    const width = 475;
    const height = 430;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const settings = queryString.stringify({ left, top, width, height });
    this._authWin = window.open(
      'about:blank',
      `Authorize ${lmsName} files`,
      settings
    );
  }

  close() {
    this._authWin.close();
    this._authWin = null;
  }

  focus() {
    if (this._authWin) {
      this._authWin.focus();
    }
  }

  /**
   * Show the authorization window and wait for it to be closed, which happens
   * either when authorization is completed or if the user manually closes
   * the window.
   *
   * In order to check the authorization status after the window closes, make
   * an API call and check for a successful response.
   */
  async authorize() {
    if (!this._authWin) {
      throw new Error('Authorization failed');
    }
    const authQuery = queryString.stringify({ auth_token: this._authToken });
    const authUrl = `/authorize_lms_file_access?${authQuery}`;
    this._authWin.location = authUrl;

    return new Promise(resolve => {
      const timer = setInterval(() => {
        if (this._authWin.closed) {
          clearInterval(timer);
          resolve();
        }
      }, 300);
    });
  }
}
