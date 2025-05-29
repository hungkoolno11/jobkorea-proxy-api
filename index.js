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

    const decodedXML = iconv.decode(response.data, 'euc-kr');

    // In log XML để debug nếu cần
    console.log('===== XML RAW START =====');
    console.log(decodedXML);
    console.log('===== XML RAW END =====');

    // Cấu hình phân tích an toàn hơn
    const parser = new xml2js.Parser({
      explicitArray: false,
      trim: true,
      normalize: true,
      normalizeTags: true
    });

// Tạm thời trả lại XML thô để kiểm tra
res.setHeader('Content-Type', 'text/plain; charset=utf-8');
res.send(decodedXML);


  } catch (err) {
    console.error('❌ Request error:', err.message);
    res.status(500).json({ error: 'Failed to fetch data from JobKorea' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
