const googleTrends = require('google-trends-api');

googleTrends.interestOverTime({
  keyword: 'ChatGPT',
  startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
})
.then(function(results){
  console.log('SUCCESS:');
  const parsed = JSON.parse(results);
  console.log(JSON.stringify(parsed.default?.timelineData?.[0], null, 2));
})
.catch(function(err){
  console.error('ERROR:', err);
});
