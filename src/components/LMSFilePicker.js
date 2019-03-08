import { Component, Fragment, h } from 'preact';
import propTypes from 'prop-types';

import AuthWindow from '../utils/AuthWindow';
import Button from './Button';
import Dialog from './Dialog';
import DirectoryBreadcrumbs from './DirectoryBreadcrumbs';
import FileList from './FileList';
import { AuthorizationError, listFiles } from '../utils/api';

/**
 * A file picker dialog that allows the user to choose files from their
 * LMS's file storage.
 *
 * The picker will attempt to list files when mounted, and will show an
 * authorization popup if necessary.
 */
export default class LMSFilePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      /**
       * `true` if we are waiting for the user to authorize the app's access
       * to files in the LMS.
       */
      isAuthorizing: !this.props.isAuthorized,

      /**
       * The array of files returned by a call to `listFiles`.
       */
      files: [],

      /**
       * The current directory within the LMS's file system.
       */
      path: '',

      /** Set to `true` if the list of files is being fetched. */
      isLoading: true,
    };
    this._authorizeAndFetchFiles = this._authorizeAndFetchFiles.bind(this);
    this._fetchFiles = this._fetchFiles.bind(this);

    // `AuthWindow` instance, set only when waiting for the user to approve
    // the app's access to the user's files in the LMS.
    this._authWindow = null;
  }

  componentDidMount() {
    if (this.state.isAuthorizing) {
      this._authorizeAndFetchFiles();
    } else {
      this._fetchFilesOrPromptToAuthorize();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Re-fetch files if user navigated to a different directory.
    if (this.state.path !== prevState.path) {
      this._fetchFiles();
    }
  }

  async _fetchFiles() {
    this.setState({ isLoading: true });
    const { authToken } = this.props;
    const files = await listFiles(authToken, this.state.path);
    this.setState({ isLoading: false, files });
  }

  async _fetchFilesOrPromptToAuthorize() {
    this.setState({ isAuthorizing: false });
    try {
      await this._fetchFiles();
    } catch (e) {
      if (e instanceof AuthorizationError) {
        // Show authorization prompt.
        this.setState({ isAuthorizing: true });
      }
    }
  }

  async _authorizeAndFetchFiles() {
    this.setState({ isAuthorizing: true });

    if (this._authWindow) {
      this._authWindow.focus();
      return;
    }

    const { authToken, lmsName } = this.props;
    this._authWindow = new AuthWindow({ authToken, lmsName });

    try {
      await this._authWindow.authorize();
      await this._fetchFilesOrPromptToAuthorize();

      if (this.props.onAuthorized) {
        this.props.onAuthorized();
      }
    } finally {
      this._authWindow.close();
      this._authWindow = null;
    }
  }

  render() {
    const { lmsName, onCancel, onSelectFile } = this.props;
    const { files, isAuthorizing, isLoading, path } = this.state;

    const changePath = path => this.setState({ path });

    const selectFile = file => {
      if (file.type === 'directory') {
        this.setState({ path: path + '/' + file.name });
      } else {
        onSelectFile(path + '/' + file.name);
      }
    };

    const cancel = () => {
      if (this._authWindow) {
        this._authWindow.close();
      }
      onCancel();
    };

    const title = isAuthorizing
      ? 'Allow file access'
      : `Select file from ${lmsName}`;

    return (
      <Dialog
        contentClass="LMSFilePicker__dialog"
        title={title}
        onCancel={cancel}
        buttons={
          isAuthorizing && [
            <Button
              key="showAuthWindow"
              onClick={this._authorizeAndFetchFiles}
              label="Authorize"
            />,
          ]
        }
      >
        {isAuthorizing && (
          <p>
            To select a file, you must authorize Hypothesis to access your files
            in {lmsName}.
          </p>
        )}
        {!isAuthorizing && (
          <Fragment>
            <DirectoryBreadcrumbs
              path={path}
              onChangePath={changePath}
              isLoading={isLoading}
            />
            <FileList files={files} onSelectFile={selectFile} />
          </Fragment>
        )}
      </Dialog>
    );
  }
}

LMSFilePicker.propTypes = {
  /**
   * Auth token for use in calls to the backend.
   */
  authToken: propTypes.string,

  /**
   * A hint as to whether the backend believes the user has authorized our
   * LMS app's access to the user's files in the LMS.
   */
  isAuthorized: propTypes.bool,

  /**
   * The name of the LMS to display in API controls, eg. "Canvas".
   */
  lmsName: propTypes.string,

  /** Callback invoked if the user cancels file selection. */
  onCancel: propTypes.func,

  /**
   * Callback invoked with the path of the selected file if the user makes
   * a selection.
   */
  onSelectFile: propTypes.func,

  /**
   * Callback invoked when authorization succeeds.
   */
  onAuthorized: propTypes.func,
};
