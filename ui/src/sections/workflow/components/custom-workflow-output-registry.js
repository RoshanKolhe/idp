export const outputRegistry = {
    ingestion: {
        channelTypeUI: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        fileName: {
                            type: 'string'
                        }
                    }
                },
                fileCount: {
                    type: 'number',
                },
            }
        },
        channelTypeProcess: {
            type: 'object',
            properties: {
                documentDetails: {type: 'object'},
                fileDetails: {type: 'object'},
                extractedFields: {type: 'array'}
            }
        }
    },
    notification: {
        success: {
            type: 'boolean'
        }
    },
}