const { Counters } = require('../model/counters');

// implementing the pattern in https://www.mongodb.com/docs/v2.2/tutorial/create-an-auto-incrementing-field/
// in order to force unique id (number)
async function getNextSequence(name) {
  const ret = await Counters.findOneAndUpdate({ _id: name }, {
    $inc: { seq: 1 },
    $set: { _id: name },
  }, { upsert: true });
  if (ret) {
    return ret.seq;
  }
  return 0;
}

module.exports = {
  getNextSequence,
};
