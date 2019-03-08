import classNames from 'classnames';
import propTypes from 'prop-types';
import { h } from 'preact';

export default function Button({
  className = '',
  label,
  onClick,
  type = 'button',
}) {
  return (
    <button
      className={classNames({ Button: true, [className]: true })}
      onClick={onClick}
      type={type}
    >
      {label}
    </button>
  );
}

Button.propTypes = {
  className: propTypes.string,
  label: propTypes.string,
  onClick: propTypes.func,
  type: propTypes.string,
};
