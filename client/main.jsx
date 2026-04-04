import React from 'react';
import { createRoot } from 'react-dom/client';
import { Meteor } from 'meteor/meteor';
import '/imports/ui/styles/global.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Landing } from '../imports/ui/pages/Landing';
import { Login } from '../imports/ui/pages/Login';
import { Discover } from '../imports/ui/pages/Discover';
import { Matches } from '../imports/ui/pages/Matches';
import { TrialDetail } from '../imports/ui/pages/TrialDetail';
import { Profile } from '../imports/ui/pages/Profile';
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
              <Discover />
            </AppLayout>
          }
        />

        <Route
          path="/matches"
          element={
            <AppLayout>
              <Matches />
            </AppLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <AppLayout>
              <Profile />
            </AppLayout>
          }
        />

        <Route
          path="/trial/:id"
          element={
            <AppLayout>
              <TrialDetail />
            </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
});
