import { h } from 'preact';
import propTypes from 'prop-types';

/**
 * A breadcrumb bar that shows the current location in the directory hierarchy
 * and provides links to go up to parent directories.
 */
export default function DirectoryBreadcrumbs({
  path,
  onChangePath,
  isLoading,
}) {
  const nonEmptyParts = path.split('/').filter(part => part !== '');
  const segments = ['Files', ...nonEmptyParts];
  const changeDir = segmentIndex => {
    const destPath = segments.slice(1, segmentIndex + 1).join('/');
    onChangePath(destPath);
  };

  return (
    <div className="DirectoryBreadcrumbs">
      {segments.slice(0, -1).map((segment, index) => [
        <a
          className="DirectoryBreadcrumbs__link"
          key={index}
          href="#"
          onClick={() => changeDir(index)}
        >
          {segment}
        </a>,
        <span key={index + '>'} className="DirectoryBreadcrumbs__separator">
          {' > '}
        </span>,
      ])}
      <span>
        <b>{segments[segments.length - 1]}</b>
      </span>
      {isLoading && (
        <img
          className="DirectoryBreadcrumbs__loading-icon"
          src="/assets/icons/spinner.svg"
        />
      )}
    </div>
  );
}

DirectoryBreadcrumbs.propTypes = {
  /**
   * If `true`, a loading indicator is displayed to indicate that the directory
   * contents are being fetched.
   */
  isLoading: propTypes.bool,

  /** Slash-separated path of the current location. */
  path: propTypes.string,
  /**
   * Callback invoked with the selected path when the user clicks a link
   * to navigate up the directory tree.
   */
  onChangePath: propTypes.func,
};
