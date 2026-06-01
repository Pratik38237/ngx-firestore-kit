export class FirestorePaths {

    public static readonly CLIENTS_COLLECTION = 'clients';
    public static readonly BATCH_JOBS_COLLECTION = 'batchJobs';

    public static getBatchJobDocumentPath(clientId: string, batchJobDocumentId: string): string[] {
        return [
            FirestorePaths.CLIENTS_COLLECTION,
            clientId,
            FirestorePaths.BATCH_JOBS_COLLECTION,
            batchJobDocumentId
        ];
    }

    public static getBatchJobCollectionPath(clientId: string): string[] {
        return [
            FirestorePaths.CLIENTS_COLLECTION,
            clientId,
            FirestorePaths.BATCH_JOBS_COLLECTION
        ];
    }

}
