export const getCorrectLengthValue = (value: string, maxLength: number) => {
    const valueLength = value.length

    const correctValue = valueLength > maxLength ? value.slice(-maxLength) : value

    return correctValue
}
