import {IdpApplication} from './application';

export async function migrate(args: string[]) {
  const existingSchema = args.includes('--rebuild') ? 'drop' : 'alter';
  console.log('Migrating schemas (%s existing schema)', existingSchema);

  const app = new IdpApplication();
  await app.boot();
  await app.migrateSchema({
    existingSchema,
    models: [
      'User', 
      'ProcessType', 
      'FileType', 
      'Processes',
      'DocumentType',
      'BluePrint',
      'ProcessInstances',
      'ProcessInstanceDocuments',
      'ProcessInstanceSecrets',
      'Levels',
      'Member',
      'Escalation'
    ],
  });
  // Connectors usually keep a pool of opened connections,
  // this keeps the process running even after all work is done.
  // We need to exit explicitly.
  process.exit(0);
}

migrate(process.argv).catch(err => {
  console.error('Cannot migrate database schema', err);
  process.exit(1);
});
