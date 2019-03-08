import { createRef, h } from 'preact';
import { useEffect } from 'preact/hooks';
import propTypes from 'prop-types';

import Button from './Button';
import Dialog from './Dialog';

export default function URLFilePicker({ onCancel, onSelectURL }) {
  const input = createRef();
  const form = createRef();
  const submit = () => {
    if (form.current.checkValidity()) {
      onSelectURL(input.current.value);
    } else {
      form.current.reportValidity();
    }
  };

  useEffect(() => {
    input.current.focus();
  }, [input.current]);

  return (
    <Dialog contentClass="URLFilePicker__dialog" title="Enter URL" onCancel={onCancel} buttons={[
      <Button key="submit" label="Submit" onClick={submit}/>,
    ]}>
      <p>Enter the URL of any publicly available web page or PDF.</p>
      <form ref={form} className="u-flex-row">
          <label className="label" htmlFor="url">
            Link:{' '}
          </label>
          <input
            className="u-stretch u-cross-stretch"
            name="path"
            type="url"
            placeholder="https://example.com/article.pdf"
            required={true}
            ref={input}
          />
        </form>
    </Dialog>
  );
}

URLFilePicker.propTypes = {
  onCancel: propTypes.func,
  onSelectURL: propTypes.func,
};
