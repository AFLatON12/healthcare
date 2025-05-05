using StackExchange.Redis;
using System;

public class RedisClient
{
    private static Lazy<ConnectionMultiplexer> lazyConnection = new Lazy<ConnectionMultiplexer>(() =>
    {
        var configOptions = new ConfigurationOptions
        {
            EndPoints = { "redis-17951.c16.us-east-1-2.ec2.redns.redis-cloud.com:17951" },
            User = "default",
            Password = "ohHSogWVwmMdyBH9AIEFqZzKgbUrbK1E"
        };
        return ConnectionMultiplexer.Connect(configOptions);
    });

    public static ConnectionMultiplexer Connection => lazyConnection.Value;

    public static IDatabase GetDatabase()
    {
        return Connection.GetDatabase();
    }
}
