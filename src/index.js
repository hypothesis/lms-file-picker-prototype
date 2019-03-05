import './styles/index.scss';

import { h, render } from 'preact';

import FilePickerApp from './components/FilePickerApp';

const rootEl = document.querySelector('#app');
const config = JSON.parse(
  document.querySelector('.js-hypothesis-config').textContent
);

const { authToken, lmsName } = config;

render(<FilePickerApp authToken={authToken} lmsName={lmsName} />, rootEl);
