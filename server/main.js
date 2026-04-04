import { Meteor } from 'meteor/meteor';
import Trials from '../imports/api/trials/collection';
import '../imports/api/matches/collection';
import '../imports/api/trials/publications';
import '../imports/api/matches/methods';
import '../imports/api/users/methods';

const CLINICAL_TRIALS_URL =
  'https://clinicaltrials.gov/api/v2/studies?format=json&pageSize=100&filter.overallStatus=RECRUITING&fields=NCTId,BriefTitle,OverallStatus,Phase,LeadSponsorName,LocationCity,LocationState,StartDate,CompletionDate,Condition,BriefSummary';

async function syncTrials() {
  try {
    const response = await fetch(CLINICAL_TRIALS_URL);
    const data = await response.json();
    const studies = data.studies || [];

    for (const study of studies) {
      const proto = study.protocolSection;
      const locations = proto.contactsLocationsModule?.locations;
      const firstLocation = locations?.[0];
      const city = firstLocation?.city;
      const state = firstLocation?.state;
      const location =
        city && state ? `${city}, ${state}` : city || state || null;

      const trialData = {
        nctId: proto.identificationModule.nctId,
        title: proto.identificationModule.briefTitle,
        status: proto.statusModule.overallStatus,
        phase: proto.designModule?.phases?.[0] || 'N/A',
        sponsor: proto.sponsorCollaboratorsModule?.leadSponsor?.name || null,
        location,
        startDate: proto.statusModule?.startDateStruct?.date || null,
        endDate: proto.statusModule?.completionDateStruct?.date || null,
        conditions: proto.conditionsModule?.conditions || [],
        plainSummary: proto.descriptionModule?.briefSummary || null,
        syncedAt: new Date(),
      };

      await Trials.upsertAsync({ nctId: trialData.nctId }, { $set: trialData });
    }

    console.log(`synced ${studies.length} trials from clinicaltrials.gov`);
  } catch (err) {
    console.error('syncTrials error:', err);
  }
}

Meteor.startup(() => {
  syncTrials();
  Meteor.setInterval(syncTrials, 86400000);
});
