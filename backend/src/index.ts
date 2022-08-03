import {google} from 'googleapis';
const sheets = google.sheets('v4');

//const spreadsheetId = '1oF4Abo1kJmjGhtFhJy_DbR44XfEVsCLqcc53jeTDy8U';
const spreadsheetId = '12HNlysOizY2H49YrqKD5V3J-hb64hkeAN2j1rcKyWY4';

const initAuth = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: '../service-key.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const authClient = await auth.getClient();
  google.options({auth: authClient});
};

//=====================================================================

class DataBlock {
  [key: string]: string;
  constructor(properties: string[], values: string[]) {
    properties.forEach((property, index) => {
      this[property] = values[index];
    });
  }
}

//=====================================================================

const getMetaData = async () => {
  //getting meta data — the ranges of the sheets

  const metaData = (
    await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: 'metaData',
    })
  ).data.values;

  if (!metaData) {
    throw new Error('meta data not found on spreadsheet');
  }

  const metaDataProperties = metaData[0];

  const ranges = [];
  for (let i = 1; i < metaData.length; i++) {
    ranges.push(new DataBlock(metaDataProperties, metaData[i]));
  }
  return ranges;
};

//=====================================================================

const getSheet = async (ranges: DataBlock[]) => {
  const sheet = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: spreadsheetId,
    ranges: ranges.map((range) => `${range.sheetName}!${range.range}`),
  });
  return sheet.data.valueRanges || [];
};

//=====================================================================

//@ts-ignore
exports.run = async (req: http.IncomingMessage, res: http.ServerResponse) => {
  
  // console.log('origin', req.get('origin'));
  // console.log(req.get('referer'));
  console.log('slkdjflsjfd');
  if (req.method !== 'GET') {
    res.status(405).send({error: 'something blew up D;'});
    return;
  }
  // if (req.get('origin') !== 'https://www.rhhsstuco.ca') {
  // if (req.get('origin') !== 'http://192.168.1.28:3000') {
  //   res.status(403).end('who are u O.o');
  //   return;
  // }

  res.set('Access-Control-Allow-Methods', 'GET');
  res.set('Access-Control-Allow-Headers', 'Authorization');
  res.set('Access-Control-Max-Age', '3600');
  // res.set('Access-Control-Allow-Origin', 'https://www.rhhsstuco.ca');
  // res.set('Access-Control-Allow-Origin', 'http://192.168.1.28:3000');
  // I'm sure this is fine and safe and definitely secure
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Credentials', 'true');

  // console.log(res);

  await initAuth();
  
  const metaData = await getMetaData();
  const rawData = await getSheet(metaData);

  const data: {[key: string]: DataBlock[]} = {};

  //format the raw data
  rawData.forEach(async (sheet) => {
    if (!sheet.values || !sheet.range) {
      return;
    }
    const sheetNameMatch = /(.+?)!/.exec(sheet.range);
    if (!sheetNameMatch) return;

    const sheetName = sheetNameMatch[1];
    data[sheetName] = [];

    const properties = sheet.values[0];
    for (let i = 1; i < sheet.values.length; i++) {
      data[sheetName].push(new DataBlock(properties, sheet.values[i]));
    }
  });
  res.status(200).end(JSON.stringify(data));
};
