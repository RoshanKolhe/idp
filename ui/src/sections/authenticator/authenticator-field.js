import PropTypes from 'prop-types';
import { Alert } from '@mui/material';
import GoogleAuthenticator from './google/google-authenticator';

export default function AuthenticatorField({ authenticator, value, onChange, agentName }) {
  if (!authenticator?.required) {
    return null;
  }

  if (authenticator.type === 'google') {
    return (
      <GoogleAuthenticator
        authenticator={authenticator}
        value={value}
        onChange={onChange}
        agentName={agentName}
      />
    );
  }

  return <Alert severity="warning">Unsupported authenticator type: {authenticator.type}</Alert>;
}

AuthenticatorField.propTypes = {
  authenticator: PropTypes.shape({
    required: PropTypes.bool,
    type: PropTypes.string,
  }),
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  agentName: PropTypes.string,
};
