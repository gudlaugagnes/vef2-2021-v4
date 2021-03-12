// TODO útfæra redis cache
import redis from 'redis';
import util from 'util';

const redisOptions = {
  url: 'redis://127.0.0.1:6379/0',
};

const client = redis.createClient(redisOptions);
const asyncGet = util.promisify(client.get).bind(client);
const asyncSet = util.promisify(client.mset).bind(client);

async function cachedEarthquakes(type, period, data)