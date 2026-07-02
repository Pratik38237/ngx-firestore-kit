import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { Firestore, collection, collectionChanges, doc, docData, getDoc } from '@angular/fire/firestore';
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
     * Fetch document once — same path as {@link listenToDocument}.
     *
     * await:
     *   const res = await firestoreData.getDocument&lt;Job&gt;(path);
     *
     * .then:
     *   firestoreData.getDocument&lt;Job&gt;(path).then(res =&gt; { ... });
     */
    /** Promise API: use with `.then()` or `await`. */
    public getDocument<T>(pathSegments: string[]): Promise<FirestoreResponse<T | null>> {
        return runInInjectionContext(this.injector, () => {
            const ref = doc(this.firestore, pathSegments[0], ...pathSegments.slice(1));
            return getDoc(ref);
        }).then((snapshot) => ({
            success: true,
            data: snapshot.exists() ? (snapshot.data() as T) : null,
            error: null,
        })).catch((error: unknown) => {
            console.error('[Firestore Document Get Error]', error);
            return { success: false, data: null, error };
        });
    }

    /**
    * Fetch document once — same path as {@link listenToDocument}.
    *
    * await:
    *   const res = await firestoreData.getDocument&lt;Job&gt;(path);
    *
    * .then:
    *   firestoreData.getDocument&lt;Job&gt;(path).then(res =&gt; { ... });
    */
    public async getDocument$<T>(pathSegments: string[]): Promise<FirestoreResponse<T | null>> {
        try {
            const snapshot = await runInInjectionContext(this.injector, () => {
                const ref = doc(this.firestore, pathSegments[0], ...pathSegments.slice(1));
                return getDoc(ref);
            });
            return {
                success: true,
                data: snapshot.exists() ? (snapshot.data() as T) : null,
                error: null,
            };
        } catch (error: unknown) {
            console.error('[Firestore Document Get Error]', error);
            return { success: false, data: null, error };
        }
    }

    /**
     * Listen realtime document changes
     */
    public listenToDocument<T>(pathSegments: string[]): Observable<FirestoreResponse<T>> {
        return runInInjectionContext(this.injector, () => {
            const documentRef = doc(this.firestore, pathSegments[0], ...pathSegments.slice(1));
            return docData(documentRef);
        }).pipe(
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
        return runInInjectionContext(this.injector, () => {
            const collectionRef = collection(this.firestore, collectionPath[0], ...collectionPath.slice(1));
            return collectionChanges(collectionRef);
        }).pipe(
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