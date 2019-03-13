import { Component, createRef, h } from 'preact';
import propTypes from 'prop-types';

import Button from './Button';
import LMSFilePicker from './LMSFilePicker';
import GoogleFilePicker from './GoogleFilePicker';
import URLFilePicker from './URLFilePicker';

/**
 * Root client-side application for the form that allows the user to choose
 * the web page or PDF for an assignment.
 */
export default class FilePickerApp extends Component {
  constructor(props) {
    super(props);

    this._form = createRef();

    this.state = {
      activeDialog: null,
      isLmsFileAccessAuthorized: props.isLmsFileAccessAuthorized,
      path: null,
      source: null,
    };
  }

  render() {
    const { authToken, lmsName } = this.props;
    const { isLmsFileAccessAuthorized } = this.state;

    const showDialog = dialog => this.setState({ activeDialog: dialog });
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

    const lmsAuthorized = () => {
      this.setState({ isLmsFileAccessAuthorized: true });
    };

    const selectURL = url => {
      this.setState(
        {
          activeDialog: null,
          source: 'url',
          path: url,
        },
        () => {
          this._form.current.submit();
        }
      );
    };

    let activeDialog;
    switch (this.state.activeDialog) {
      case 'url-file-picker':
        activeDialog = (
          <URLFilePicker
            lmsName={lmsName}
            onCancel={cancelDialog}
            onSelectURL={selectURL}
          />
        );
        break;
      case 'lms-file-picker':
        activeDialog = (
          <LMSFilePicker
            authToken={authToken}
            isAuthorized={isLmsFileAccessAuthorized}
            lmsName={lmsName}
            onAuthorized={lmsAuthorized}
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
          <h1 className="heading-1">Select web page or PDF</h1>
          <p>
            You can select content for your assignment from one of the following
            sources:
          </p>
          <input name="source" type="hidden" value={this.state.source} />
          <input name="path" type="hidden" value={this.state.path} />
          <Button
            className="FilePickerApp__source-button"
            label="Enter URL of web page or PDF"
            onClick={() => showDialog('url-file-picker')}
          />
          <Button
            className="FilePickerApp__source-button"
            label={`Select PDF from ${lmsName}`}
            onClick={() => showDialog('lms-file-picker')}
          />
          <Button
            className="FilePickerApp__source-button"
            label="Select PDF from Google Drive"
            onClick={() => showDialog('google-file-picker')}
          />
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
   * A hint as to whether the user has authorized the Hypothesis LMS app to
   * access their files in the LMS.
   */
  isLmsFileAccessAuthorized: propTypes.bool,

  /**
   * Name of the LMS to use in UI controls.
   */
  lmsName: propTypes.string,
};
