

//GENERE UNE RANDOM KEY
const generateRandomString = (length: number): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  const res = values.reduce((acc, x) => acc + possible[x % possible.length], "");
  return res;
}

//ENCODE KEY EN SHA256
const sha256 = async (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  const res = await crypto.subtle.digest('SHA-256', data)
  return res
}

//TRANSFORME LA KEY SHA256 EN BASE64
const base64encode = (input: ArrayBuffer): string => {
  const res = btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return res;
}

export const getCodeChallenge = async () => {
  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier)
  const codeChallenge = base64encode(hashed);
  return codeChallenge;
}



