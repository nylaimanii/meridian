import { Mongo } from 'meteor/mongo';

const Trials = new Mongo.Collection('trials');

export default Trials;
export { Trials };
