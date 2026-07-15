// This file is required by karma.conf.js and loads recursively all the .spec files that it finds
// in the application.

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Note: Test file loading is configured in karma.conf.js
// This file is a placeholder for test setup
