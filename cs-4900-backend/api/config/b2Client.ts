import B2 from 'backblaze-b2';

const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID!,
  applicationKey: process.env.B2_APP_KEY_ID!,
});

export default b2;