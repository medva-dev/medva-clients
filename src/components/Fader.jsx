import FadeIn from 'react-fade-in';

import { fadeInDelay } from '../const/defaults';

export default function Fader({ children, delay = undefined }) {
  return <FadeIn transitionDuration={delay || fadeInDelay}>{children}</FadeIn>;
}
