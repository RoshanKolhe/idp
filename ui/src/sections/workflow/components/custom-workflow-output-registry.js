export const outputRegistry = {
    ingestion: {
        files: {
            type: 'array',
            items:{
                fileName: {
                    type: 'string'
                }
            }
        },
        fileCount: {
            type: 'number'
        }
    },
    notification: {
        success: {
            type: 'boolean'
        }
    },
}