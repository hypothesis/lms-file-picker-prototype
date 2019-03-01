import { h } from 'preact';
import propTypes from 'prop-types';

/**
 * List of the files within a single directory.
 */
export default function FileList({ files, onSelectFile }) {
  const formatDate = isoString => new Date(isoString).toLocaleDateString();

  return (
    <div className="FileList__wrapper">
      <table className="FileList__table">
        <thead className="FileList__head">
          <tr>
            <th scope="col">Name</th>
            <th className="FileList__date-col" scole="col">
              Last modified
            </th>
          </tr>
        </thead>
        <tbody className="FileList__body">
          {files.map(file => (
            <tr
              key={file.name}
              className="FileList__row"
              onClick={() => onSelectFile(file)}
            >
              {/*
                The file name is rendered as a link to support keyboard
                access. However the click handler is on the row to provide a
                large click/tap target.
              */}
              <td>
                <img className="FileList__icon" src={file.icon} />
                <a href="#" className="FileList__name">
                  {file.name}
                </a>
              </td>
              <td className="FileList__date">
                {file.last_modified && formatDate(file.last_modified)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

FileList.propTypes = {
  /** List of file objects returned by a `listFiles` call. */
  files: propTypes.arrayOf(propTypes.object),
  /** Callback passed the selected file when the user clicks on a file. */
  onSelectFile: propTypes.func,
};
