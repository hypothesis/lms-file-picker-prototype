import { Component, createRef, h } from 'preact';
import propTypes from 'prop-types';

import Button from './Button';
import LMSFilePicker from './LMSFilePicker';
import GoogleFilePicker from './GoogleFilePicker';

/**
 * Root client-side application for the form that allows the user to choose
 * the web page or PDF for an assignment.
 */
export default class FilePickerApp extends Component {
  constructor(props) {
    super(props);

    this._selectFileFromLMS = this._selectFileFromLMS.bind(this);
    this._selectFileFromGoogleDrive = this._selectFileFromGoogleDrive.bind(
      this
    );
    this._form = createRef();

    this.state = {
      activeDialog: null,
      source: null,
      path: null,
    };
  }

  _selectFileFromLMS() {
    this.setState({ activeDialog: 'lms-file-picker' });
  }

  _selectFileFromGoogleDrive() {
    this.setState({ activeDialog: 'google-file-picker' });
  }

  render() {
    const { authToken, lmsName } = this.props;

    const cancelDialog = () => this.setState({ activeDialog: null });
    const selectLMSFile = path => {
      this.setState(
        {
          activeDialog: null,
          source: 'lms',
          path,
        },
        () => {
          this._form.current.submit();
        }
      );
    };

    const urlChanged = () => {
      const path = this._form.current.elements.path.value;
      this.setState({
        source: 'url',
        path,
      });
    };

    let activeDialog;
    switch (this.state.activeDialog) {
      case 'lms-file-picker':
        activeDialog = (
          <LMSFilePicker
            authToken={authToken}
            lmsName={lmsName}
            onCancel={cancelDialog}
            onSelectFile={selectLMSFile}
          />
        );
        break;
      case 'google-file-picker':
        activeDialog = <GoogleFilePicker onCancel={cancelDialog} />;
        break;
      default:
        activeDialog = null;
    }

    return (
      <main>
        <form className="FilePickerApp__form" ref={this._form} method="POST">
          <h1 className="heading-1">Select web page or PDF for assignment</h1>
          <div>
            <input name="source" type="hidden" value={this.state.source} />
            <div className="FilePickerApp__url-field">
              <label className="label" htmlFor="url">
                Link:{' '}
              </label>
              <input
                className="u-stretch u-cross-stretch"
                name="path"
                type="url"
                placeholder="https://example.com/article.pdf"
                required={true}
                value={this.state.path}
                onInput={urlChanged}
              />
              <Button type="submit" label="Submit" />
            </div>
            <div>
              <Button
                label={`Choose from files in ${lmsName}`}
                onClick={this._selectFileFromLMS}
              />
              <Button
                label="Choose from Google Drive"
                onClick={this._selectFileFromGoogleDrive}
              />
            </div>
          </div>
        </form>
        {activeDialog}
      </main>
    );
  }
}

FilePickerApp.propTypes = {
  /**
   * Authentication token to include in calls to the backend.
   */
  authToken: propTypes.string,

  /**
   * Name of the LMS to use in UI controls.
   */
  lmsName: propTypes.string,
};
