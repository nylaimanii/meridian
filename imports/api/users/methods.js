import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

Meteor.methods({
  'users.updateProfile': async function (profile) {
    if (!this.userId) throw new Meteor.Error('not-authorized');
    await Meteor.users.updateAsync(
      { _id: this.userId },
      { $set: { 'profile.healthData': profile } }
    );
  },
});
