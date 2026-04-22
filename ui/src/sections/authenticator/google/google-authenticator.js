import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Box, Chip, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from 'src/components/iconify';
import { WORKFLOW_HOST_API } from 'src/config-global';

const GOOGLE_AUTH_SUCCESS_EVENTS = [
  'workflow-google-auth-success',
  'google-auth-success',
  'authenticator:success',
];

function normalizeGoogleAuthPayload(payload = {}, tokenField) {
  const nestedAuth = payload.auth && typeof payload.auth === 'object' ? payload.auth : {};
  const token =
    nestedAuth[tokenField] ||
    payload[tokenField] ||
    payload.accessToken ||
    payload.access_token ||
    '';

  return {
    ...nestedAuth,
    ...payload,
    [tokenField]: token,
    connectionStatus: 'connected',
    connectedAt: payload.connectedAt || new Date().toISOString(),
    accountEmail: payload.accountEmail || payload.email || nestedAuth.accountEmail || '',
  };
}

export default function GoogleAuthenticator({ authenticator, value, onChange, agentName }) {
  const popupRef = useRef(null);
  const closeCheckIntervalRef = useRef(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [authError, setAuthError] = useState('');

  const tokenField = authenticator?.output?.tokenField || 'google_access_token';
  const authOrigin = useMemo(() => {
    try {
      return new URL(WORKFLOW_HOST_API).origin;
    } catch (error) {
      return '';
    }
  }, []);

  const connectionStatus = value?.connectionStatus || (value?.[tokenField] ? 'connected' : 'idle');
  const scopes = useMemo(() => authenticator?.scopes || [], [authenticator?.scopes]);
  const accountEmail = value?.accountEmail;

  const handleDisconnect = useCallback(() => {
    onChange({});
    setAuthError('');
  }, [onChange]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (authOrigin && event.origin !== authOrigin) {
        return;
      }

      const eventType = event.data?.type;

      if (!GOOGLE_AUTH_SUCCESS_EVENTS.includes(eventType)) {
        if (eventType === 'workflow-google-auth-error') {
          setIsConnecting(false);
          setAuthError(event.data?.payload?.error || 'Google authentication failed');
        }
        return;
      }

      const payload = event.data?.payload || event.data;
      const normalizedValue = normalizeGoogleAuthPayload(payload, tokenField);

      onChange(normalizedValue);
      setIsConnecting(false);
      setAuthError('');

      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [authOrigin, onChange, tokenField]);

  useEffect(
    () => () => {
      if (closeCheckIntervalRef.current) {
        window.clearInterval(closeCheckIntervalRef.current);
      }
    },
    []
  );

  const handleConnect = useCallback(() => {
    if (!WORKFLOW_HOST_API) {
      return;
    }

    setAuthError('');

    const params = new URLSearchParams({
      provider: authenticator?.provider || 'google',
      scopes: scopes.join(' '),
      tokenField,
      origin: window.location.origin,
      agentName: agentName || '',
    });

    const popup = window.open(
      `${WORKFLOW_HOST_API}/auth/google/start?${params.toString()}`,
      'google-auth-popup',
      'width=560,height=720,left=200,top=120'
    );

    if (!popup) {
      setAuthError('Popup was blocked by the browser');
      return;
    }

    popupRef.current = popup;
    setIsConnecting(true);

    if (closeCheckIntervalRef.current) {
      window.clearInterval(closeCheckIntervalRef.current);
    }

    closeCheckIntervalRef.current = window.setInterval(() => {
      if (popup.closed) {
        setIsConnecting(false);
        window.clearInterval(closeCheckIntervalRef.current);
      }
    }, 500);
  }, [agentName, authenticator?.provider, scopes, tokenField]);

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          backgroundColor: 'background.neutral',
        }}
      >
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Box>
              <Typography variant="subtitle2">Google Authentication</Typography>
              <Typography variant="body2" color="text.secondary">
                Connect your Google account to authorize this agent.
              </Typography>
            </Box>
            <Chip
              color={connectionStatus === 'connected' ? 'success' : 'default'}
              label={connectionStatus === 'connected' ? 'Connected' : 'Not Connected'}
              size="small"
            />
          </Stack>

          {accountEmail ? (
            <Typography variant="body2" color="text.secondary">
              Connected account: {accountEmail}
            </Typography>
          ) : null}

          {scopes.length ? (
            <Typography variant="caption" color="text.secondary">
              Scopes: {scopes.join(', ')}
            </Typography>
          ) : null}

          <Stack direction="row" spacing={1} flexWrap="wrap">
            <LoadingButton
              variant="contained"
              loading={isConnecting}
              onClick={handleConnect}
              startIcon={<Iconify icon="eva:google-fill" />}
            >
              {authenticator?.ui?.buttonLabel || 'Connect Google'}
            </LoadingButton>

            {connectionStatus === 'connected' ? (
              <LoadingButton color="inherit" variant="outlined" onClick={handleDisconnect}>
                Disconnect
              </LoadingButton>
            ) : null}
          </Stack>
        </Stack>
      </Box>

      {!WORKFLOW_HOST_API ? (
        <Alert severity="warning">
          `REACT_APP_WORKFLOW_HOST_API` is missing, so Google authentication cannot start.
        </Alert>
      ) : null}

      {authError ? <Alert severity="error">{authError}</Alert> : null}

      <Alert severity="info">
        The popup expects the OAuth callback page to send a `postMessage` success event back to this
        workflow window.
      </Alert>
    </Stack>
  );
}

GoogleAuthenticator.propTypes = {
  authenticator: PropTypes.shape({
    provider: PropTypes.string,
    scopes: PropTypes.arrayOf(PropTypes.string),
    ui: PropTypes.shape({
      buttonLabel: PropTypes.string,
    }),
    output: PropTypes.shape({
      tokenField: PropTypes.string,
    }),
  }),
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  agentName: PropTypes.string,
};
