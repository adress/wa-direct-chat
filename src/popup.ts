const STORAGE_KEY = 'wa-direct-form';

type FormState = {
  typeWa: string;
  countryCodeWA: string;
  phoneNumberWA: string;
  messageWA: string;
};

const defaultState: FormState = {
  typeWa: 'web',
  countryCodeWA: '57',
  phoneNumberWA: '',
  messageWA: '',
};

function loadState(): FormState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState;
  } catch {
    return defaultState;
  }
}

function saveState(): void {
  const state: FormState = {
    typeWa: getFieldValue('typeWa'),
    countryCodeWA: getFieldValue('countryCodeWA'),
    phoneNumberWA: getFieldValue('phoneNumberWA'),
    messageWA: getFieldValue('messageWA'),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getFieldValue(id: string): string {
  return (document.querySelector(`#${id}`) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null)?.value ?? '';
}

function setFieldValue(id: string, value: string): void {
  const el = document.querySelector(`#${id}`) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
  if (el) el.value = value;
}

function restoreState(state: FormState): void {
  setFieldValue('typeWa', state.typeWa);
  setFieldValue('countryCodeWA', state.countryCodeWA);
  setFieldValue('phoneNumberWA', state.phoneNumberWA);
  setFieldValue('messageWA', state.messageWA);
}

document.addEventListener('DOMContentLoaded', () => {
  restoreState(loadState());

  document.querySelectorAll('input, select, textarea').forEach((el) => {
    el.addEventListener('input', saveState);
    el.addEventListener('change', saveState);
  });

  document.querySelector('#sendMessageWA')?.addEventListener('click', () => {
    const typeWa = getFieldValue('typeWa') || 'web';
    const countryCode = getFieldValue('countryCodeWA');
    const phoneNumber = getFieldValue('phoneNumberWA');
    const message = getFieldValue('messageWA');

    const domains: Record<string, string> = {
      web: 'web.whatsapp.com',
      desktop: 'api.whatsapp.com',
    };

    chrome.tabs.create({
      url: `https://${domains[typeWa]}/send/?phone=${countryCode}${phoneNumber}&text=${encodeURIComponent(message)}`,
    });
  });
});
