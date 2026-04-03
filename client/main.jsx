import React from 'react';
import { createRoot } from 'react-dom/client';
import { Meteor } from 'meteor/meteor';
import '/imports/ui/styles/global.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Landing } from '../imports/ui/pages/Landing';
import { Login } from '../imports/ui/pages/Login';
import { AppLayout } from '../imports/ui/layouts/AppLayout';
import { AuthLayout } from '../imports/ui/layouts/AuthLayout';

Meteor.startup(() => {
  const container = document.getElementById('react-target');
  const root = createRoot(container);
  root.render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />

        <Route
          path="/onboard"
          element={
            <AppLayout>
              <div>Onboarding Page</div>
            </AppLayout>
          }
        />

        <Route
          path="/discover"
          element={
            <AppLayout>
              <div>Discover Page</div>
            </AppLayout>
          }
        />

        <Route
          path="/matches"
          element={
            <AppLayout>
              <div>Matches Page</div>
            </AppLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <AppLayout>
              <div>Profile Page</div>
            </AppLayout>
          }
        />

        <Route
          path="/trial/:id"
          element={
            <AppLayout>
              <div>Trial Detail Page</div>
            </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
});
