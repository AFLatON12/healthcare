const redis = require('redis');

(async () => {
  const client = redis.createClient({
    socket: {
      host: 'redis-17951.c16.us-east-1-2.ec2.redns.redis-cloud.com',
      port: 17951
    },
    username: 'default',
    password: 'ohHSogWVwmMdyBH9AIEFqZzKgbUrbK1E'
  });

  client.on('error', (err) => console.error('Redis Client Error', err));

  await client.connect();

  await client.set('foo', 'bar');
  const result = await client.get('foo');

  console.log(result); // >>> bar

  await client.quit();
})();
