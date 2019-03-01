import { h } from 'preact';
import { zIndexScale } from '../utils/style';

/**
 * A semi-transparent background to be displayed behind dialogs to focus the
 * user's attention on the dialog content and prevent them from clicking on
 * controls outside the dialog.
 */
export default function DialogBackground() {
  return (
    <div
      style={{
        backgroundColor: 'black',
        bottom: 0,
        left: 0,
        opacity: 0.5,
        position: 'fixed',
        right: 0,
        top: 0,
        zIndex: zIndexScale.dialogBackground,
      }}
    />
  );
}
