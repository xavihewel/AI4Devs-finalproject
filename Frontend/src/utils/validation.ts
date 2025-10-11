import { useTranslation } from 'react-i18next';

export const useValidation = () => {
  const { t } = useTranslation('validation');

  return {
    required: (field: string) => t('required', { field }),
    email: () => t('email.invalid'),
    minLength: (min: number) => t('minLength', { min }),
    maxLength: (max: number) => t('maxLength', { max }),
    range: (min: number, max: number) => t('range', { min, max }),
    numeric: () => t('numeric'),
    phone: () => t('phone.invalid'),
    date: () => t('date.invalid'),
    time: () => t('time.invalid'),
  };
};
