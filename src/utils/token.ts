import * as Keychain from 'react-native-keychain';

/**
 * Save token securely via Keychain.
 * We store key=auth and value=token.
 */



export async function setToken(token: string): Promise<void> {
  await Keychain.setGenericPassword('auth', token, {
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

/**
 * Get stored token. Returns null if not found.
 */
export async function getToken(): Promise<string | null> {
  try {
    const creds = await Keychain.getGenericPassword();
    if (!creds) return null;
    return creds.password;
  } catch (err) {
    console.warn('getToken error', err);
    return null;
  }
}

/**
 * Remove token completely.
 */
export async function removeToken(): Promise<void> {
  try {
    await Keychain.resetGenericPassword();
  } catch (err) {
    console.warn('removeToken error', err);
  }
}
