import { Meteor } from 'meteor/meteor';
import Trials from './collection';

Meteor.publish('trials.all', function () {
  return Trials.find({}, { limit: 100 });
});

Meteor.publish('trials.single', function (nctId) {
  return Trials.find({ nctId: nctId });
});
