import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

/**
 * Custom library provider that configures and initializes Firebase and Firestore 
 * behind the scenes for the consuming application.
 */
export function provideFirestoreKit(firebaseConfig: any): EnvironmentProviders {
    return makeEnvironmentProviders([
        // The library handles the Angular Fire initialization boilerplate internally
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore())
    ]);
}