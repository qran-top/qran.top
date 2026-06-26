const https = require('https');

https.get('https://api.alquran.cloud/v1/quran/quran-simple-clean', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const apiData = JSON.parse(data);
      console.log("Code:", apiData.code);
      console.log("Has data:", !!apiData.data);
      console.log("Has surahs:", !!(apiData.data && apiData.data.surahs));
      if (apiData.data && apiData.data.surahs) {
        console.log("First surah:", apiData.data.surahs[0].name);
      }
    } catch (e) {
      console.error(e);
    }
  });
});
