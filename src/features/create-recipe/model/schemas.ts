import { string, object } from 'yup'
import { useTranslation } from '@/shared/lib/i18n'
import Localization from './schema.localization.json'

const { t } = useTranslation(Localization)

export const createRecipeBasicInfoSchema = object({
    title: string().default('').max(100, `${t('max')} - 100`),
    description: string().default('').max(500, `${t('max')} - 500`),
    image: string().default('')
})