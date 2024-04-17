import { MongoExceptionFilter } from './mongo.exception'

function convertToSlug(text: String) {
    return text.toLowerCase()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-");
}

export {
    convertToSlug,
    MongoExceptionFilter
}