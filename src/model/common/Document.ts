class Document {
    name: string | null
    url: string | null
    file: Express.Multer.File | null

    public static create(
        name: string = null,
        url: string = null,
        file: Express.Multer.File = null
    ): Document {
        const doc = new Document()
        doc.name = name
        doc.url = url
        doc.file = file
        return doc
    }
}

export default Document