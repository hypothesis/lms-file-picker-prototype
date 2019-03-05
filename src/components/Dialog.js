import { h } from 'preact';
import propTypes from 'prop-types';
import classNames from 'classnames';

import Button from './Button';
import { zIndexScale } from '../utils/style';

/**
 * A modal dialog with a title and a row of action buttons at the bottom.
 */
export default function Dialog({
  children,
  contentClass,
  onCancel,
  title,
  buttons,
}) {
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

  // TODO - Accessibility guidance:
  // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/dialog_role
  //
  // - Save and restore keyboard focus when dialog is mounted and unmounted.
  // - Focus an appropriate control when the dialog is first shown.
  // - Keep tab focus within the dialog when active.

  return (
    <div
      role="dialog"
      aria-labelledby="Dialog__title"
      onKeyDown={handleKey}
      tabIndex="0"
      ref={rootEl}
    >
      <div className="Dialog__background" style={{ zIndex: zIndexScale.dialogBackground }}/>
      <div className="Dialog__container" style={{ zIndex: zIndexScale.dialog }}>
        <div
          className={classNames({
            Dialog__content: true,
            [contentClass]: true,
          })}
        >
          <h1 className="Dialog__title" id="Dialog__title">
            {title}
          </h1>
          {children}
          <div className="Dialog__actions">
            {buttons}
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
   * Additional buttons to display at the bottom of the dialog.
   *
   * The "Cancel" button is added automatically if the `onCancel` prop is set.
   */
  buttons: propTypes.arrayOf(propTypes.element),

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
