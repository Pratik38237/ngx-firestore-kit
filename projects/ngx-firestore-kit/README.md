# ngx-firestore-wrapper-kit — Integration Guide

Steps to install, configure, and use this library in an Angular application.

<p style="font-size: 1.15rem; line-height: 1.6;"><strong>Requirements:</strong> Angular ^20.3.0, a Firebase project with Firestore enabled.</p>

<div style="background: #f6f8fa; border: 1px solid #d0d7de; border-left: 4px solid #0969da; border-radius: 8px; padding: 1rem 1.25rem; margin: 1rem 0; font-size: 1rem; line-height: 1.6;">

<p style="font-size: 1.05rem; font-weight: 600; margin: 0 0 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid #d8dee4;">On this page</p>

<ul style="margin: 0; padding-left: 1.25rem;">
  <li style="margin-bottom: 0.35rem;"><a href="#1-install" style="color: #0969da; text-decoration: none;">1. Install</a></li>
  <li style="margin-bottom: 0.35rem;"><a href="#2-firebase-configuration" style="color: #0969da; text-decoration: none;">2. Firebase configuration</a></li>
  <li style="margin-bottom: 0.35rem;"><a href="#3-register-the-library-in-your-app" style="color: #0969da; text-decoration: none;">3. Register the library in your app</a></li>
  <li style="margin-bottom: 0.35rem;"><a href="#4-usage" style="color: #0969da; text-decoration: none;">4. Usage</a></li>
  <li style="margin-bottom: 0.35rem;"><a href="#5-checklist" style="color: #0969da; text-decoration: none;">5. Checklist</a></li>
  <li style="margin-bottom: 0.35rem;"><a href="#exports-reference" style="color: #0969da; text-decoration: none;">Exports reference</a></li>
</ul>

<p style="font-size: 0.95rem; font-weight: 600; margin: 1rem 0 0.5rem; color: #57606a;">Usage sections</p>

<ul style="margin: 0; padding-left: 1.25rem;">
  <li style="margin-bottom: 0.35rem;"><a href="#response-shape" style="color: #0969da; text-decoration: none;">Response shape</a></li>
  <li style="margin-bottom: 0.35rem;"><a href="#listen-to-a-document-real-time" style="color: #0969da; text-decoration: none;">Listen to a document (real-time)</a></li>
  <li style="margin-bottom: 0.35rem;"><a href="#listen-to-a-collection-real-time" style="color: #0969da; text-decoration: none;">Listen to a collection (real-time)</a></li>
  <li style="margin-bottom: 0.35rem;"><a href="#path-helpers" style="color: #0969da; text-decoration: none;">Path helpers</a></li>
</ul>

</div>

---

<a id="1-install"></a>

## 1. Install

### From npm

```bash
npm install ngx-firestore-wrapper-kit
```

---

<a id="2-firebase-configuration"></a>

## 2. Firebase configuration

Add the Firebase config to your environment file (`src/environments/environment.ts`):

```typescript
import { FirebaseOptions } from '@angular/fire/app';

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_PROJECT.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID'
  } as FirebaseOptions
};
```

Get these values from [Firebase Console](https://console.firebase.google.com/) → **Project settings** → **Your apps** → Web app config.

---

<a id="3-register-the-library-in-your-app"></a>

## 3. Register the library in your app

**`app.config.ts`:**

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideFirestoreKit } from 'ngx-firestore-wrapper-kit';
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirestoreKit(environment.firebaseConfig)
  ]
};
```

---

<a id="4-usage"></a>

## 4. Usage

Import from the package:

```typescript
import {
  FirestoreDataService,
  FirestoreResponse
} from 'ngx-firestore-wrapper-kit';
```

Inject `FirestoreDataService` where you need Firestore data. It is `providedIn: 'root'`, so no extra providers are required.

<a id="response-shape"></a>

### Response shape

All listener methods return `Observable<FirestoreResponse<T>>`:

```typescript
interface FirestoreResponse<T> {
  success: boolean;
  data: any;      // payload when success is true
  error: unknown; // error when success is false
}
```

Always check `success` before using `data`.

---

<a id="listen-to-a-document-real-time"></a>

### Listen to a document (real-time)

```typescript
import { inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FirestoreDataService, FirestoreResponse } from 'ngx-firestore-wrapper-kit';

interface BatchJob {
  status: string;
  progress: number;
}

export class BatchJobComponent implements OnInit, OnDestroy {
  private readonly firestoreData = inject(FirestoreDataService);
  private sub?: Subscription;

  response: FirestoreResponse<BatchJob> | null = null;

  ngOnInit(): void {
    // collection / collection-001 (document) / subCollection / sub-collection-001 (document)
    const path = ['collection', 'collection-001', 'subCollection', 'sub-collection-001'];

    this.sub = this.firestoreData
      .listenToDocument<BatchJob>(path)
      .subscribe((res) => (this.response = res));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
```

---

<a id="listen-to-a-collection-real-time"></a>

### Listen to a collection (real-time)

```typescript
import { inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FirestoreDataService, FirestoreResponse } from 'ngx-firestore-wrapper-kit';

interface BatchJob {
  status: string;
  progress: number;
}

export class BatchJobListComponent implements OnInit, OnDestroy {
  private readonly firestoreData = inject(FirestoreDataService);
  private sub?: Subscription;

  response: FirestoreResponse<BatchJob[]> | null = null;

  ngOnInit(): void {
    // collection / collection-001 (document) / subCollection
    const path = ['collection', 'collection-001', 'subCollection'];

    this.sub = this.firestoreData
      .listenToCollection<BatchJob>(path)
      .subscribe((res) => (this.response = res));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
```

---

<a id="path-helpers"></a>

### Path helpers

Build paths as **string arrays** — alternating collection and document IDs:

```typescript
// Document: collection / {collectionId} (document) / subCollection / {subCollectionId} (document)
const documentPath = ['collection', 'collection-001', 'subCollection', 'sub-collection-001'];

// Collection: collection / {collectionId} (document) / subCollection
const collectionPath = ['collection', 'collection-001', 'subCollection'];
```

**Example with the service:**

```typescript
this.firestoreData
  .listenToDocument<ChildDocument>(documentPath)
  .subscribe((res) => { /* ... */ });
```

---

<a id="5-checklist"></a>

## 5. Checklist

- [ ] `ngx-firestore-wrapper-kit` installed
- [ ] Firebase config added to `environment.ts`
- [ ] `provideFirestoreKit(environment.firebaseConfig)` in root providers
- [ ] `FirestoreDataService` injected in components/services
- [ ] Paths passed as `string[]`
- [ ] Subscriptions unsubscribed in `ngOnDestroy` (or use `async` pipe)

---

<a id="exports-reference"></a>

## Exports reference

| Export | Use |
|--------|-----|
| `provideFirestoreKit(config)` | Bootstrap Firebase + Firestore in the app |
| `FirestoreDataService` | `listenToDocument()`, `listenToCollection()` |
| `FirestoreResponse<T>` | Type for listener responses |
