<template>
	<VButton
		:color="ButtonColors.White"
		@click="openReviewModal"
	>
		<div class="flex items-center justify-center gap-[12px]">
			<div>{{ t('leaveReview') }}</div>
			<div>
				<IconArrowRight icon-color="#319A6E" />
			</div>
		</div>
	</VButton>
	<!-- TODO: можно вынести в entity/Comment -->
	<!-- А лучше вынести в соседний файл, так как модалка не будет переиспользоваться и нет смысла нести её в Entities -->
	<VModal
		:show="isReviewModalOpen"
		@close="closeReviewModal"
	>
		<div class="flex items-center justify-between">
			<div class="text-xl text-darkGray">
				{{ t('review') }}
			</div>
			<button
				class="text-2xl w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[14px] cursor-pointer"
				@click="closeReviewModal"
			>
				<IconClose />
			</button>
		</div>
		<div class="max-w-md mx-auto">
			<div>
				<div class="flex flex items-center justify-between">
					<div class="flex items-center gap-[8px]">
						<template
							v-for="star in 5"
							:key="star"
						>
							<button
								class="w-[32px] h-[32px] rounded-full text-slateGray text-sm  font-bold flex items-center justify-center focus:outline-none"
								:class="star <= rating ? 'bg-forestGreen text-white' : 'bg-lightGray text-slateGray'"
								@click="setRating(star)"
							>
								{{ star }}
							</button>
						</template>
					</div>
					<span class="text-xs text-slateGray truncate">{{ ratingText }}</span>
				</div>

				<textarea
					v-model="review"
					:placeholder="t('opinion')"
					:maxlength="500"
					class="border rounded px-2 py-4 text-base min-h-[122px] w-[100%] mt-[20px] mb-[12px]"
					@change="handleChangeReview"
				/>

				<span
					v-if="errorMessage"
					class=""
				>{{ errorMessage }}</span>

				<!-- TODO: addPhotoKey обновляет компонент, нужно переделать -->
				<VAddPhoto
					:key="addPhotoKey"
					:icon-color="'#1C1C1C'"
					:width-image="54"
					:height-image="54"
					:title="t('attachPhoto')"
					:height-main="66"
					backgrounds="#F3F3F3"
					:icon="IconPhoto"
					:on-image-uploaded="handleImageUpload"
					@upload:image="handleUploadImage"
				/>
				<VButton
					class="mt-[20px]"
					:color="ButtonColors.Green"
					@click="submitReview"
				>
					{{ t('submitButton') }}
				</VButton>
			</div>
		</div>
	</VModal>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref, computed } from 'vue'
import { IconClose, IconPhoto, IconArrowRight } from '@/shared/components/Icon'
import { VButton, ButtonColors } from 'shared/components/Button'
import Localization from './AddCommentButton.localization.json'
import { useTranslation } from 'shared/lib/i18n'
import { VModal } from 'shared/components/Modal'
import { VAddPhoto } from 'shared/components/AddPhoto'

import { addComment } from '../../api'

const { t } = useTranslation(Localization)

const props = defineProps<{
    recipeId: number,
}>()

const emit = defineEmits<{
	(event: 'submit'): void;
}>()

// TODO: отрефакторить и разнести

const isReviewModalOpen = ref(false)
const rating = ref(0)
const review = ref('')
const reviewImage = ref<File[] | null>(null)
const addPhotoKey = ref(0)
const errorMessage = ref('')

const handleChangeReview = () => {
	errorMessage.value = ''
}

const setRating = (value: number) => {
	rating.value = value

	errorMessage.value = ''
}

const ratingText = computed(() => {
	switch (rating.value) {
		case 1:
			return t('rating_1')
		case 2:
			return t('rating_2')
		case 3:
			return t('rating_4')
		case 4:
			return t('rating_4')
		case 5:
			return t('rating_5')
		default:
			return ''
	}
})

const openReviewModal = () => {
	isReviewModalOpen.value = true
	resetReviewForm()
}

const closeReviewModal = () => {
	isReviewModalOpen.value = false
	resetReviewForm()
}

const resetReviewForm = () => {
	rating.value = 0
	review.value = ''
	reviewImage.value = null
	addPhotoKey.value++ // Это заставит компонент VAddPhoto пересоздаться
	errorMessage.value = ''
}

// TODO: переписать
const handleImageUpload = () => {
	reviewImage.value = null
}

const handleUploadImage = (_: string | null, imageFile: File) => {
    reviewImage.value?.push(imageFile)
}

const submitReview = async () => {
	if (rating.value === 0 || review.value.trim() === '') {
        // TODO: добавить нормальную валидацию
		// Либо добавить переменную errorMessage
		errorMessage.value = t('error')
		return
	}

	// TODO: куда-то добавить проверку на максимальное кол-во файлов, проверку размера файла и типа файла

	const newComment = {
		text: review.value,
		rating: rating.value,
        ...(reviewImage.value && {
            images: reviewImage.value,
        })
	}

    const { execute, loading } = addComment({ recipeId: props.recipeId }, newComment)

    await execute()

    // TODO: после отправки отзыва - нужно перезапросить рецепт
    // Отрефакторить этот код
	emit('submit')

	closeReviewModal()
}
</script>

<style>
.border {
	border: 1px solid #E1E1E1;
}

.truncate {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>