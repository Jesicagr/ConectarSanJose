export function getPhoneLink(numero: string, esWhatsapp?: boolean): string {
  const cleaned = numero.replace(/[\s\-\(\)\+]/g, '');
  if (esWhatsapp) {
    return `https://wa.me/${cleaned}`;
  }
  return `tel:${cleaned}`;
}

export function getAddressLink(direccion: string): string {
  return `https://www.google.com/maps/search/${encodeURIComponent(direccion)}`;
}

export function getEmailLink(email: string): string {
  return `mailto:${email}`;
}

export function isUrl(str: string): boolean {
  return str.startsWith('http://') || str.startsWith('https://');
}

export function getWebLink(sitio: string): string {
  if (isUrl(sitio)) return sitio;
  return `https://${sitio}`;
}
