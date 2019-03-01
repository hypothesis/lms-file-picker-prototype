import { h } from 'preact';
import propTypes from 'prop-types';
import classNames from 'classnames';

import Button from './Button';
import DialogBackground from './DialogBackground';
import { zIndexScale } from '../utils/style';

/**
 * A modal dialog with a title and a row of action buttons at the bottom.
 */
export default function Dialog({ children, contentClass, onCancel, title }) {
  const handleKey = event => {
    event.stopPropagation();

    if (event.key === 'Escape' && typeof onCancel === 'function') {
      onCancel();
    }
  };

  const rootEl = el => {
    if (el) {
      el.focus();
    }
  };

  return (
    <div onKeyDown={handleKey} tabIndex="0" ref={rootEl}>
      <DialogBackground />
      <div className="Dialog__container" style={{ zIndex: zIndexScale.dialog }}>
        <div
          className={classNames({
            Dialog__content: true,
            [contentClass]: true,
          })}
        >
          <h1 className="Dialog__title">{title}</h1>
          {children}
          <div className="Dialog__actions">
            {onCancel && <Button onClick={onCancel} label="Cancel" />}
          </div>
        </div>
      </div>
    </div>
  );
}

Dialog.propTypes = {
  /** The content of the dialog. */
  children: propTypes.arrayOf(propTypes.element),

  /**
   * Class applied to the content of the dialog.
   *
   * The primary role of this class is to set the size of the dialog.
   */
  contentClass: propTypes.string,

  /** The title of the dialog. */
  title: propTypes.string,

  /**
   * A callback to invoke when the user cancels the dialog. If provided,
   * a "Cancel" button will be displayed.
   */
  onCancel: propTypes.func,
};
