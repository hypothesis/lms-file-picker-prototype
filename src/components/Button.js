import propTypes from 'prop-types';
import { h } from 'preact';

export default function Button({ label, onClick, type = 'button' }) {
  return (
    <button className="Button" onClick={onClick} type={type}>
      {label}
    </button>
  );
}

Button.propTypes = {
  label: propTypes.string,
  onClick: propTypes.func,
  type: propTypes.string,
};
