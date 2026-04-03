import { Mongo } from 'meteor/mongo';

const SavedMatches = new Mongo.Collection('savedMatches');

export default SavedMatches;
export { SavedMatches };
