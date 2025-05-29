const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const iconv = require('iconv-lite');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('✅ JobKorea API proxy is running. Use /jobkorea to fetch data.');
});

app.get('/jobkorea', async (req, res) => {
  try {
    const response = await axios.get('http://company.jobkorea.co.kr/Network/Popup_Xml_sample_1.asp', {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const decoded = iconv.decode(response.data, 'euc-kr');
    console.log(decoded); // 👈 In XML ra logs


    xml2js.parseString(decoded, { explicitArray: false }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'XML parsing error' });
      }

      res.json(result);
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data from JobKorea' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
