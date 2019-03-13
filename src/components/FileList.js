import { Fragment, h } from 'preact';
import propTypes from 'prop-types';

import Table from './Table';

/**
 * List of the files within a single directory.
 */
export default function FileList({
  files,
  selectedFile,
  onSelectFile,
  onUseFile,
}) {
  const formatDate = isoString => new Date(isoString).toLocaleDateString();
  const columns = [
    {
      label: 'Name',
      className: 'FileList__name-col',
    },
    {
      label: 'Last modified',
      className: 'FileList__date-col',
    },
  ];

  return (
    <Table
      columns={columns}
      items={files}
      selectedItem={selectedFile}
      onSelectItem={onSelectFile}
      onUseItem={onUseFile}
      renderItem={file => (
        <Fragment>
          <td>
            <img className="FileList__icon" src={file.icon} />
            <a href="#" className="FileList__name">
              {file.name}
            </a>
          </td>
          <td className="FileList__date">
            {file.last_modified && formatDate(file.last_modified)}
          </td>
        </Fragment>
      )}
    />
  );
}

FileList.propTypes = {
  /** List of file objects returned by a `listFiles` call. */
  files: propTypes.arrayOf(propTypes.object),

  /** The file within `files` which is currently selected. */
  selectedFile: propTypes.object,

  /**
   * Callback passed the selected file when the user clicks on a file in
   * order to select it before performing further actions on it.
   */
  onSelectFile: propTypes.func,

  /**
   * Callback passed when the user double-clicks a file or directory to
   * indicate that they want to use it.
   */
  onUseFile: propTypes.func,
};
