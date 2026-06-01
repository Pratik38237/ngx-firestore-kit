import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { Firestore, collection, collectionChanges, doc, docData } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';

export interface FirestoreResponse<T> {
    success: boolean;
    data: any;
    error: unknown;
}

@Injectable({
    providedIn: 'root'
})

export class FirestoreDataService {

    private readonly firestore = inject(Firestore);
    private readonly injector = inject(Injector);

    /**
     * Listen realtime document changes
     */
    public listenToDocument<T>(pathSegments: string[]): Observable<FirestoreResponse<T>> {
        const documentRef = doc(this.firestore, pathSegments[0], ...pathSegments.slice(1));
        return runInInjectionContext(this.injector, () => docData(documentRef)).pipe(
            // Cast the response to the expected type
            filter((response) => response != null),
            // Return the response
            map((response) => ({ success: true, data: response, error: null })),
            // Handle errors
            catchError((error: unknown) => {
                console.error('[Firestore Document Listener Error]', error);
                return of({ success: false, data: null, error });
            })

        );
    }

    /**
     * Listen realtime collection changes
     */
    public listenToCollection<T>(collectionPath: string[]): Observable<FirestoreResponse<T[]>> {
        const collectionRef = collection(this.firestore, collectionPath[0], ...collectionPath.slice(1));
        return runInInjectionContext(this.injector, () => collectionChanges(collectionRef)).pipe(
            // Cast the response to the expected type
            map((response) => ({ success: true, data: response, error: null })),
            // Handle errors
            catchError((error: unknown) => {
                console.error('[Firestore Collection Listener Error]', error);
                return of({ success: false, data: null, error });
            })
        );
    }
}