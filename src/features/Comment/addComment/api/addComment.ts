import useApi from '@/shared/lib/api/use-api'

type AddCommentParams = {
    recipeId: number;
}

// TODO: нужно использовать FormData
// "images[]": "до 5 файлов, jpeg/png/jpg, max:2MB каждый"
type AddCommentPayload = {
    text: string,
    rating: number,
    images?: File[],
}

export function addComment(params: AddCommentParams, payload: AddCommentPayload) {
    const formData = new FormData();

    (Object.keys(payload) as Array<keyof typeof payload>).forEach((key) => {
        if (key === 'images') {
            payload[key]?.forEach((file, index) => {
                formData.append(`images[${index}]`, file)
            })
        } else {
            formData.append(key, String(payload[key]))
        }
    })

    return useApi('post', `/recipes/${params.recipeId}/comments`, payload)
}
