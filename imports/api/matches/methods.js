import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import SavedMatches from './collection';

Meteor.publish('matches.mine', function () {
  if (!this.userId) return this.ready();
  return SavedMatches.find({ userId: this.userId });
});

Meteor.methods({
  'matches.save': async function (trialId) {
    check(trialId, String);
    if (!this.userId) throw new Meteor.Error('not-authorized');
    await SavedMatches.upsertAsync(
      { userId: this.userId, trialId },
      {
        $set: {
          userId: this.userId,
          trialId,
          status: 'saved',
          savedAt: new Date(),
          lastUpdated: new Date(),
        },
      }
    );
  },

  'matches.pass': async function (trialId) {
    check(trialId, String);
    if (!this.userId) throw new Meteor.Error('not-authorized');
    await SavedMatches.upsertAsync(
      { userId: this.userId, trialId },
      {
        $set: {
          userId: this.userId,
          trialId,
          status: 'passed',
          savedAt: new Date(),
          lastUpdated: new Date(),
        },
      }
    );
  },

  'matches.super': async function (trialId) {
    check(trialId, String);
    if (!this.userId) throw new Meteor.Error('not-authorized');
    await SavedMatches.upsertAsync(
      { userId: this.userId, trialId },
      {
        $set: {
          userId: this.userId,
          trialId,
          status: 'super',
          savedAt: new Date(),
          lastUpdated: new Date(),
        },
      }
    );
  },

  'matches.updateStatus': async function (trialId, newStatus) {
    check(trialId, String);
    check(newStatus, String);
    if (!this.userId) throw new Meteor.Error('not-authorized');
    await SavedMatches.updateAsync(
      { userId: this.userId, trialId },
      { $set: { status: newStatus, lastUpdated: new Date() } }
    );
  },
});
