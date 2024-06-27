import { emulateRequest } from 'shared/lib/debug'
import { Plan } from 'entities/Plan/types/typesPlan'

export const copyPlan = (planId: Plan['id']) => {
	console.log(planId)
	return emulateRequest({ milliSeconds: 1500 })
}
