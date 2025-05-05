import SignedInNavigationBar from './SignedInNavigationBar';
import SignedOutNavigationBar from './SignedOutNavigationBar';

function NavigationBar({ isLoggedIn, onLogout, onBack }) {
  if (isLoggedIn) {
    return <SignedInNavigationBar onLogout={onLogout} onBack={onBack} />;
  } else {
    return <SignedOutNavigationBar />;
  }
}

export default NavigationBar;
